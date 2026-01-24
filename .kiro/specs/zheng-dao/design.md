# Design Document: 证道 (ZhengDao)

## Overview

证道 (ZhengDao) 是一个基于区块链的打卡激励系统，采用三层架构：

1. **Frontend Layer (Next.js PWA)**: 提供用户界面，处理钱包连接、图片上传、状态展示
2. **Backend API Layer (Next.js API Routes)**: 处理 AI 图片验证、演示模式逻辑
3. **Smart Contract Layer (Solidity)**: 管理资金、计算收益、执行 PVP 惩罚机制

系统的核心设计理念是通过经济激励（虚拟收益）和社交压力（PVP 惩罚）来促进用户养成持续打卡的习惯。

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend (Next.js PWA)"
        UI[User Interface]
        WC[Wallet Connector - wagmi]
        SC[State Management]
    end
    
    subgraph "Backend API"
        API[/api/verify]
        AIV[AI Verifier - GPT-4o]
    end
    
    subgraph "Blockchain"
        Contract[ZhengDao Smart Contract]
        Wallet[User Wallet]
    end
    
    UI --> WC
    UI --> API
    WC --> Wallet
    WC --> Contract
    API --> AIV
    Contract --> Wallet
    
    style Contract fill:#D43628,color:#fff
    style UI fill:#000,color:#fff
```

### Component Interaction Flow

**Check-In Flow:**
1. User captures/selects image → Frontend
2. Frontend uploads image → Backend API
3. Backend API sends to GPT-4o → AI Verification
4. AI returns result → Backend API → Frontend
5. Frontend calls Smart Contract → mockCheckIn or recordCheckIn
6. Smart Contract updates balance → Emits event
7. Frontend listens to event → Updates UI

**PVP Penalty Flow:**
1. Smart Contract monitors last check-in timestamps
2. When 48 hours elapsed → Identify inactive users
3. Calculate 10% penalty from inactive users
4. Distribute penalty to active users proportionally
5. Emit PenaltyDistributed event
6. Frontend displays notifications

## Components and Interfaces

### Frontend Components

#### 1. HeroStatus Component
**Purpose**: Display user's asset overview and statistics

**Props:**
```typescript
interface HeroStatusProps {
  totalBalance: bigint;
  principalAmount: bigint;
  yieldAmount: bigint;
  checkInCount: number;
  currentStreak: number;
  walletAddress: string;
}
```

**Responsibilities:**
- Display total balance with serif font styling
- Show principal vs yield breakdown
- Display check-in statistics
- Update in real-time after transactions

#### 2. CheckInRing Component
**Purpose**: Main check-in button with circular progress indicator

**Props:**
```typescript
interface CheckInRingProps {
  lastCheckInTime: number;
  onCheckIn: () => Promise<void>;
  isLoading: boolean;
}
```

**Responsibilities:**
- Display circular progress ring showing time until penalty
- Handle image capture/selection
- Trigger check-in submission
- Show loading state during verification
- Display seal stamp animation on success

#### 3. WeekGrid Component
**Purpose**: Display 7-day check-in history

**Props:**
```typescript
interface WeekGridProps {
  checkInRecords: Array<{
    date: Date;
    completed: boolean;
    timestamp?: number;
  }>;
}
```

**Responsibilities:**
- Render 7-day grid with dates
- Show red seal marks for completed days
- Show empty/grayed state for missed days
- Support scrolling for historical records

#### 4. DuelCard Component
**Purpose**: Display leaderboard and PVP events

**Props:**
```typescript
interface DuelCardProps {
  leaderboard: Array<{
    address: string;
    balance: bigint;
    streak: number;
    rank: number;
  }>;
  penaltyEvents: Array<{
    penalizedUser: string;
    amount: bigint;
    beneficiaries: string[];
    timestamp: number;
  }>;
  currentUserAddress: string;
}
```

**Responsibilities:**
- Display top users ranked by balance
- Highlight current user's position
- Show recent penalty events
- Update in real-time

### Backend API

#### /api/verify Endpoint

**Request:**
```typescript
interface VerifyRequest {
  image: File | string; // Base64 or multipart
  userAddress: string;
}

// Headers
{
  'x-demo-mode'?: 'true'; // Optional demo mode header
}
```

**Response:**
```typescript
interface VerifyResponse {
  success: boolean;
  reason?: string; // If rejected
  confidence?: number; // AI confidence score
  demoMode?: boolean; // If demo mode was used
}
```

**Logic:**
1. Check for x-demo-mode header → If present, return success immediately
2. Validate image size (max 10MB)
3. Send image to OpenAI GPT-4o with prompt:
   ```
   "Analyze this image and determine if it shows a person engaged in fitness activities (exercising, gym, sports) or reading activities (reading books, studying). Return 'valid' if either activity is clearly present, otherwise return 'invalid' with a brief reason."
   ```
4. Set 30-second timeout → If exceeded, return success (fallback)
5. Parse AI response and return result

### Smart Contract

#### ZhengDao.sol

**State Variables:**
```solidity
struct UserData {
    uint256 principalAmount;
    uint256 totalBalance;
    uint256 lastCheckInTime;
    uint256 checkInCount;
}

mapping(address => UserData) public users;
address public owner;
uint256 public constant YIELD_RATE = 50; // 0.5% = 50/10000
uint256 public constant PENALTY_RATE = 1000; // 10% = 1000/10000
uint256 public constant PENALTY_THRESHOLD = 48 hours;
```

**Key Functions:**

**deposit()**
```solidity
function deposit() external payable {
    require(msg.value > 0, "Deposit must be greater than 0");
    
    UserData storage user = users[msg.sender];
    user.principalAmount += msg.value;
    user.totalBalance += msg.value;
    user.lastCheckInTime = block.timestamp;
    
    emit Deposit(msg.sender, msg.value, block.timestamp);
}
```

**checkIn()**
```solidity
function checkIn() external {
    UserData storage user = users[msg.sender];
    require(user.totalBalance > 0, "No active deposit");
    
    // Calculate yield: 0.5% of current balance
    uint256 yield = (user.totalBalance * YIELD_RATE) / 10000;
    user.totalBalance += yield;
    user.lastCheckInTime = block.timestamp;
    user.checkInCount += 1;
    
    emit CheckIn(msg.sender, user.totalBalance, block.timestamp);
}
```

**mockCheckIn() - Demo Mode**
```solidity
function mockCheckIn(address userAddress) external onlyOwner {
    UserData storage user = users[userAddress];
    require(user.totalBalance > 0, "No active deposit");
    
    uint256 yield = (user.totalBalance * YIELD_RATE) / 10000;
    user.totalBalance += yield;
    user.lastCheckInTime = block.timestamp;
    user.checkInCount += 1;
    
    emit CheckIn(userAddress, user.totalBalance, block.timestamp);
}
```

**executePenalty(address[] calldata inactiveUsers)**
```solidity
function executePenalty(address[] calldata inactiveUsers) external {
    uint256 totalPenalty = 0;
    uint256 activeUserCount = 0;
    uint256 totalActiveBalance = 0;
    
    // Collect penalties from inactive users
    for (uint i = 0; i < inactiveUsers.length; i++) {
        address inactiveUser = inactiveUsers[i];
        UserData storage user = users[inactiveUser];
        
        // Verify user is actually inactive
        require(
            block.timestamp - user.lastCheckInTime > PENALTY_THRESHOLD,
            "User is not inactive"
        );
        
        uint256 penalty = (user.principalAmount * PENALTY_RATE) / 10000;
        user.principalAmount -= penalty;
        user.totalBalance -= penalty;
        totalPenalty += penalty;
    }
    
    // Calculate total active balance for proportional distribution
    // (Simplified: in production, would iterate through all users)
    // For hackathon, we can maintain a separate active users list
    
    // Distribute penalty proportionally
    // Implementation details depend on how we track active users
    
    emit PenaltyDistributed(inactiveUsers, totalPenalty, block.timestamp);
}
```

**withdraw()**
```solidity
function withdraw() external {
    UserData storage user = users[msg.sender];
    uint256 amount = user.totalBalance;
    require(amount > 0, "No balance to withdraw");
    
    user.totalBalance = 0;
    user.principalAmount = 0;
    
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
    
    emit Withdrawal(msg.sender, amount, block.timestamp);
}
```

**Events:**
```solidity
event Deposit(address indexed user, uint256 amount, uint256 timestamp);
event CheckIn(address indexed user, uint256 newBalance, uint256 timestamp);
event PenaltyDistributed(address[] inactiveUsers, uint256 totalPenalty, uint256 timestamp);
event Withdrawal(address indexed user, uint256 amount, uint256 timestamp);
```

## Data Models

### Frontend State Management

```typescript
// User State
interface UserState {
  address: string | null;
  isConnected: boolean;
  principalAmount: bigint;
  totalBalance: bigint;
  lastCheckInTime: number;
  checkInCount: number;
  checkInRecords: CheckInRecord[];
}

// Check-In Record
interface CheckInRecord {
  date: Date;
  completed: boolean;
  timestamp?: number;
  txHash?: string;
}

// Leaderboard Entry
interface LeaderboardEntry {
  address: string;
  balance: bigint;
  streak: number;
  rank: number;
  isCurrentUser: boolean;
}

// Penalty Event
interface PenaltyEvent {
  penalizedUsers: string[];
  totalPenalty: bigint;
  beneficiaries: string[];
  timestamp: number;
  txHash: string;
}

// UI State
interface UIState {
  isCheckingIn: boolean;
  isDemoMode: boolean;
  showAnimation: boolean;
  errorMessage: string | null;
}
```

### Smart Contract Data Structures

```solidity
struct UserData {
    uint256 principalAmount;    // Original deposit amount
    uint256 totalBalance;       // Principal + accumulated yield
    uint256 lastCheckInTime;    // Timestamp of last check-in
    uint256 checkInCount;       // Total number of check-ins
}
```

### API Data Models

```typescript
// Verification Request
interface VerificationRequest {
  image: string; // Base64 encoded
  userAddress: string;
  timestamp: number;
}

// OpenAI API Request
interface OpenAIRequest {
  model: "gpt-4o";
  messages: Array<{
    role: "user";
    content: Array<{
      type: "text" | "image_url";
      text?: string;
      image_url?: {
        url: string;
      };
    }>;
  }>;
  max_tokens: number;
}

// OpenAI API Response
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I've identified several areas where properties can be consolidated:

**Smart Contract Core Behavior:**
- Properties 5.1, 5.2, 5.5 (yield calculation, balance update, timestamp recording) can be combined into one comprehensive "check-in updates state correctly" property
- Properties 2.3 and 2.5 (deposit recording and event emission) can be combined into one "deposit updates state and emits event" property
- Properties 12.3 and 12.4 (withdrawal transfer and balance reset) can be combined into one "withdrawal completes correctly" property

**UI Error Handling:**
- Properties 1.4, 2.4, 3.5, 12.5, 13.1, 13.2, 13.3, 13.4 all test error display - can be consolidated into one "errors are displayed with appropriate messages" property

**UI Display Properties:**
- Properties 7.1, 7.2, 7.3 (dashboard display) can be combined into one "dashboard displays all user statistics" property
- Properties 14.1, 14.2, 14.4, 14.5 (leaderboard display) can be combined into one "leaderboard displays correctly" property
- Properties 9.1, 9.2, 9.3, 9.4 (weekly grid display) can be combined into one "weekly grid displays check-in history correctly" property

**Demo Mode:**
- Properties 4.5, 11.3 (demo mode bypassing verification) are testing the same behavior at different layers - can be combined

**Event Emission:**
- Properties 2.5, 5.3, 6.4 all test event emission - these are important but can be tested as part of their parent operations

After reflection, we'll focus on unique, high-value properties that provide comprehensive validation.

### Core Correctness Properties

**Property 1: Deposit increases user balance correctly**
*For any* valid deposit amount, calling the deposit function should increase the user's principal and total balance by exactly that amount, and emit a Deposit event with correct parameters.
**Validates: Requirements 2.3, 2.5**

**Property 2: Check-in calculates and applies yield correctly**
*For any* user with a positive balance, calling checkIn should increase their total balance by exactly 0.5% (50/10000), update their lastCheckInTime to current timestamp, increment checkInCount by 1, and emit a CheckIn event.
**Validates: Requirements 5.1, 5.2, 5.3, 5.5**

**Property 3: Withdrawal transfers full balance and resets state**
*For any* user with a positive balance, calling withdraw should transfer the entire totalBalance to the user's wallet and reset both principalAmount and totalBalance to zero.
**Validates: Requirements 12.3, 12.4**

**Property 4: Penalty calculation is correct for inactive users**
*For any* user whose lastCheckInTime is more than 48 hours ago, executing penalty should deduct exactly 10% (1000/10000) from their principalAmount and totalBalance.
**Validates: Requirements 6.1, 6.2**

**Property 5: Penalty distribution is proportional to active user balances**
*For any* set of active users and collected penalty amount, the distribution should allocate to each active user an amount proportional to their balance relative to the total active balance, such that the sum of distributions equals the total penalty.
**Validates: Requirements 6.3**

**Property 6: mockCheckIn behaves identically to checkIn for owner**
*For any* user address, when the contract owner calls mockCheckIn(address), it should produce the same state changes as if that user called checkIn() directly (same yield calculation, timestamp update, count increment).
**Validates: Requirements 11.1, 11.2**

**Property 7: Only contract owner can call mockCheckIn**
*For any* non-owner address attempting to call mockCheckIn, the transaction should revert with an access control error.
**Validates: Requirements 11.1**

**Property 8: Image size validation rejects oversized uploads**
*For any* image with file size greater than 10MB, the upload should be rejected before reaching the AI verifier, and an error message should be displayed.
**Validates: Requirements 3.4**

**Property 9: Demo mode bypasses AI verification**
*For any* image upload with x-demo-mode header set to 'true', the verification API should return success immediately without calling OpenAI GPT-4o.
**Validates: Requirements 4.5, 11.3**

**Property 10: AI verification timeout triggers fallback approval**
*For any* verification request that takes longer than 30 seconds, the system should automatically return success (approve the check-in) as a fallback mechanism.
**Validates: Requirements 4.4**

**Property 11: Wallet connection triggers wagmi connect**
*For any* user clicking the connect button, the system should call the wagmi connect function to initiate wallet connection.
**Validates: Requirements 1.2**

**Property 12: Successful wallet connection displays address and balance**
*For any* successful wallet connection, the UI should display both the connected wallet address and the current balance.
**Validates: Requirements 1.3**

**Property 13: Wallet disconnection resets state**
*For any* connected wallet, calling disconnect should reset the user state to initial values (address: null, isConnected: false, balances: 0).
**Validates: Requirements 1.5**

**Property 14: Dashboard displays all user statistics**
*For any* user viewing the dashboard, the UI should render totalBalance, principalAmount, yieldAmount (calculated as totalBalance - principalAmount), checkInCount, and currentStreak.
**Validates: Requirements 7.1, 7.2, 7.3**

**Property 15: Weekly grid displays exactly 7 days**
*For any* user viewing the weekly grid, exactly 7 day entries should be rendered, each showing the date and check-in status (completed with red seal or missed with empty state).
**Validates: Requirements 9.1, 9.2, 9.3, 9.4**

**Property 16: Leaderboard sorts users by balance descending**
*For any* set of users, the leaderboard should display them in descending order by totalBalance, with the highest balance at rank 1.
**Validates: Requirements 14.1**

**Property 17: Leaderboard displays required user information**
*For any* user in the leaderboard, the display should include truncated wallet address, totalBalance, and checkInStreak.
**Validates: Requirements 14.2**

**Property 18: Current user is highlighted in leaderboard**
*For any* connected user viewing the leaderboard, their own entry should have visual highlighting applied (distinct styling).
**Validates: Requirements 14.4**

**Property 19: Seal stamp animation displays on successful check-in**
*For any* successful check-in, the UI should render the seal stamp animation component using Framer Motion.
**Validates: Requirements 8.1**

**Property 20: Color palette matches traditional aesthetic**
*For all* UI elements, the color values should use exactly #FFFFFF (white background), #000000 (black ink), and #D43628 (seal red), with no other primary colors.
**Validates: Requirements 8.3**

**Property 21: All UI elements have zero border-radius**
*For all* UI elements, the computed border-radius CSS property should be 0 (sharp edges, no rounded corners).
**Validates: Requirements 8.4**

**Property 22: Numeric displays use serif fonts**
*For all* numeric text elements (balances, counts, percentages), the font-family should include a serif font.
**Validates: Requirements 7.4**

**Property 23: Check-in button triggers camera or file picker**
*For any* user clicking the check-in button, the system should invoke either the device camera API or file picker dialog.
**Validates: Requirements 3.1**

**Property 24: Image selection displays preview**
*For any* selected image, the UI should render a preview of that image before submission.
**Validates: Requirements 3.2**

**Property 25: Image submission uploads to verification API**
*For any* confirmed image submission, the frontend should make a POST request to /api/verify with the image data.
**Validates: Requirements 3.3**

**Property 26: Verification API calls OpenAI GPT-4o**
*For any* verification request without demo mode, the API should make a request to OpenAI's API with the image and appropriate prompt.
**Validates: Requirements 4.1**

**Property 27: Frontend updates balance after check-in event**
*For any* CheckIn event emitted by the smart contract, the frontend should update the displayed balance to match the new balance from the event.
**Validates: Requirements 5.4, 7.5**

**Property 28: Penalty events display notifications**
*For any* PenaltyDistributed event, the frontend should display notifications to both penalized users (showing deduction) and rewarded users (showing bonus).
**Validates: Requirements 6.5**

**Property 29: Error messages are displayed for all failure cases**
*For any* failed operation (transaction failure, network error, verification rejection, gas estimation failure), the UI should display an appropriate error message with relevant details.
**Validates: Requirements 1.4, 2.4, 3.5, 12.5, 13.1, 13.2, 13.3, 13.4**

**Property 30: All errors are logged to console**
*For any* error occurring in the system, an error log entry should be written to the browser console with error details.
**Validates: Requirements 13.5**

**Property 31: Demo mode indicator displays when active**
*For any* state where isDemoMode is true, the UI should render a visible indicator showing that demo mode is enabled.
**Validates: Requirements 11.5**

**Property 32: Demo mode can be toggled via URL parameter**
*For any* URL containing the demo mode parameter (e.g., ?demo=true), the system should enable demo mode on page load.
**Validates: Requirements 11.4**

**Property 33: Touch gestures are supported on interactive elements**
*For all* interactive elements (buttons, cards, inputs), touch event handlers should be registered to support mobile touch interactions.
**Validates: Requirements 10.5**

**Property 34: Leaderboard updates in real-time on rank changes**
*For any* change in user balances that affects rankings, the leaderboard display should update to reflect the new order.
**Validates: Requirements 14.3**

**Property 35: Weekly grid updates after animation completes**
*For any* successful check-in, after the seal stamp animation completes, the weekly grid should display the new check-in record.
**Validates: Requirements 8.5**

## Error Handling

### Smart Contract Error Handling

**Access Control Errors:**
- `mockCheckIn`: Reverts with "Ownable: caller is not the owner" if non-owner attempts to call
- All functions: Validate caller permissions before state changes

**State Validation Errors:**
- `checkIn`: Reverts with "No active deposit" if user has zero balance
- `withdraw`: Reverts with "No balance to withdraw" if user has zero balance
- `executePenalty`: Reverts with "User is not inactive" if user checked in within 48 hours
- `deposit`: Reverts with "Deposit must be greater than 0" if msg.value is zero

**Transfer Errors:**
- `withdraw`: Reverts with "Transfer failed" if ETH transfer fails
- All functions: Use call{value} pattern with success check

### Frontend Error Handling

**Wallet Connection Errors:**
- Connection rejected by user → Display "Wallet connection rejected"
- No wallet installed → Display "Please install MetaMask or another Web3 wallet"
- Network mismatch → Display "Please switch to the correct network"

**Transaction Errors:**
- Insufficient gas → Display "Insufficient gas. Please increase gas limit."
- Insufficient balance → Display "Insufficient balance for transaction"
- User rejected transaction → Display "Transaction rejected"
- Transaction reverted → Display contract revert reason

**API Errors:**
- Network timeout → Display "Network timeout. Please try again."
- Server error (5xx) → Display "Server error. Please try again later."
- Invalid response → Display "Invalid response from server"

**Image Upload Errors:**
- File too large → Display "Image size must be less than 10MB"
- Invalid file type → Display "Please upload a valid image file (JPG, PNG)"
- Upload failed → Display "Upload failed. Please try again."

**AI Verification Errors:**
- Verification rejected → Display AI rejection reason (e.g., "图片未包含健身或读书场景")
- Timeout (>30s) → Automatically approve (fallback mechanism)
- API error → Automatically approve (fallback mechanism)

### Error Recovery Strategies

**Retry Mechanisms:**
- Failed transactions: Allow user to retry with adjusted gas
- Failed uploads: Allow user to retry upload
- Network errors: Automatic retry with exponential backoff (max 3 attempts)

**Fallback Mechanisms:**
- AI verification timeout → Auto-approve check-in
- AI API unavailable → Auto-approve check-in
- Demo mode → Bypass all verification

**State Recovery:**
- Failed transactions: State remains unchanged (atomic operations)
- Wallet disconnection: Clear all user state, return to initial view
- Page refresh: Restore state from blockchain and local storage

## Testing Strategy

### Dual Testing Approach

This project requires both **unit tests** and **property-based tests** for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and integration points
- **Property tests**: Verify universal properties across randomized inputs

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Library Selection:**
- **Smart Contracts (Solidity)**: Use **Foundry's property testing** (built-in fuzzing)
- **Frontend (TypeScript)**: Use **fast-check** library for property-based testing

**Test Configuration:**
- Minimum **100 iterations** per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: zheng-dao, Property {number}: {property_text}`

**Example Property Test Structure (TypeScript with fast-check):**
```typescript
import fc from 'fast-check';

// Feature: zheng-dao, Property 2: Check-in calculates and applies yield correctly
test('checkIn increases balance by exactly 0.5%', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.bigInt({ min: 1n, max: 1000000n }), // Random initial balance
      async (initialBalance) => {
        // Setup: Create user with initialBalance
        const user = await setupUserWithBalance(initialBalance);
        
        // Action: Perform check-in
        await user.checkIn();
        
        // Assert: Balance increased by exactly 0.5%
        const expectedYield = (initialBalance * 50n) / 10000n;
        const expectedBalance = initialBalance + expectedYield;
        const actualBalance = await user.getBalance();
        
        expect(actualBalance).toBe(expectedBalance);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Example Property Test Structure (Solidity with Foundry):**
```solidity
// Feature: zheng-dao, Property 1: Deposit increases user balance correctly
function testFuzz_DepositIncreasesBalance(uint256 depositAmount) public {
    // Bound the fuzz input to reasonable values
    depositAmount = bound(depositAmount, 0.01 ether, 100 ether);
    
    // Setup
    address user = address(0x1);
    vm.deal(user, depositAmount);
    
    // Get initial balance
    (uint256 initialPrincipal, uint256 initialTotal,,) = zhengDao.users(user);
    
    // Action: Deposit
    vm.prank(user);
    zhengDao.deposit{value: depositAmount}();
    
    // Assert: Balance increased by deposit amount
    (uint256 newPrincipal, uint256 newTotal,,) = zhengDao.users(user);
    assertEq(newPrincipal, initialPrincipal + depositAmount);
    assertEq(newTotal, initialTotal + depositAmount);
}
```

### Unit Testing Strategy

**Smart Contract Unit Tests (Foundry):**
- Test specific scenarios: first deposit, multiple check-ins, withdrawal after yield
- Test edge cases: zero balance withdrawal, penalty on exactly 48-hour boundary
- Test access control: non-owner calling mockCheckIn
- Test event emission: verify event parameters for each operation
- Test integration: deposit → multiple check-ins → penalty → withdrawal flow

**Frontend Unit Tests (Jest + React Testing Library):**
- Component rendering: verify each component renders with correct props
- User interactions: click handlers, form submissions, wallet connection
- State management: verify state updates after actions
- Error display: verify error messages appear for different error types
- Integration: full check-in flow from button click to UI update

**API Unit Tests (Jest):**
- Endpoint behavior: verify /api/verify returns correct responses
- Demo mode: verify x-demo-mode header bypasses verification
- Timeout handling: verify 30-second timeout triggers fallback
- Error handling: verify API errors are handled gracefully
- OpenAI integration: mock OpenAI API and verify request format

### Test Coverage Goals

**Smart Contract:**
- 100% function coverage
- 100% branch coverage
- All properties tested with property-based tests
- All edge cases tested with unit tests

**Frontend:**
- 80%+ code coverage
- All user interactions tested
- All error paths tested
- All properties tested with property-based tests

**API:**
- 100% endpoint coverage
- All error scenarios tested
- Demo mode and fallback mechanisms tested

### Testing Workflow

1. **Development**: Write unit tests alongside implementation
2. **Property Tests**: Implement property-based tests after core functionality works
3. **Integration**: Test end-to-end flows with all components
4. **Manual Testing**: Test PWA installation, mobile responsiveness, wallet integration
5. **Demo Testing**: Verify demo mode works for hackathon presentation

### Special Testing Considerations

**Blockchain Testing:**
- Use Foundry's local testnet for fast iteration
- Test with different wallet states (empty, funded, multiple users)
- Test gas costs to ensure operations are affordable
- Test event emission and listening

**AI Verification Testing:**
- Mock OpenAI API responses for unit tests
- Test with real API in integration tests (limited runs due to cost)
- Verify fallback mechanisms work when API is unavailable
- Test demo mode thoroughly for hackathon presentation

**PWA Testing:**
- Test manifest.json validity
- Test service worker registration
- Test offline behavior (graceful degradation)
- Manual testing on actual mobile devices

**Demo Mode Testing:**
- Verify mockCheckIn works for owner
- Verify x-demo-mode header bypasses verification
- Verify demo mode indicator displays correctly
- Test URL parameter activation
