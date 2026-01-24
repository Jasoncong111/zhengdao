# Implementation Plan: 证道 (ZhengDao)

## Overview

This implementation plan breaks down the ZhengDao blockchain check-in system into incremental coding tasks. The approach follows a bottom-up strategy: smart contract first, then backend API, then frontend components, and finally integration and PWA setup.

## Tasks

- [ ] 1. Set up project structure and dependencies
  - Initialize Next.js project with TypeScript and Tailwind CSS
  - Install dependencies: wagmi, viem, framer-motion, fast-check (dev)
  - Set up Foundry for smart contract development
  - Create directory structure: app/, components/, contracts/, lib/
  - Configure TypeScript, ESLint, and Tailwind
  - Create manifest.json for PWA
  - _Requirements: 10.1_

- [ ] 2. Implement ZhengDao smart contract
  - [ ] 2.1 Create ZhengDao.sol with core data structures
    - Define UserData struct (principalAmount, totalBalance, lastCheckInTime, checkInCount)
    - Define state variables and constants (YIELD_RATE, PENALTY_RATE, PENALTY_THRESHOLD)
    - Define events (Deposit, CheckIn, PenaltyDistributed, Withdrawal)
    - _Requirements: 2.3, 5.1, 6.2_
  
  - [ ] 2.2 Implement deposit function
    - Accept payable deposits
    - Update user's principalAmount and totalBalance
    - Record initial lastCheckInTime
    - Emit Deposit event
    - _Requirements: 2.3, 2.5_
  
  - [ ] 2.3 Write property test for deposit
    - **Property 1: Deposit increases user balance correctly**
    - **Validates: Requirements 2.3, 2.5**
  
  - [ ] 2.4 Implement checkIn function
    - Calculate 0.5% yield from current balance
    - Add yield to totalBalance
    - Update lastCheckInTime to block.timestamp
    - Increment checkInCount
    - Emit CheckIn event
    - _Requirements: 5.1, 5.2, 5.3, 5.5_
  
  - [ ] 2.5 Write property test for checkIn
    - **Property 2: Check-in calculates and applies yield correctly**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.5**
  
  - [ ] 2.6 Implement withdraw function
    - Transfer full totalBalance to user
    - Reset principalAmount and totalBalance to zero
    - Emit Withdrawal event
    - Handle transfer failures
    - _Requirements: 12.3, 12.4_
  
  - [ ] 2.7 Write property test for withdraw
    - **Property 3: Withdrawal transfers full balance and resets state**
    - **Validates: Requirements 12.3, 12.4**
  
  - [ ] 2.8 Implement mockCheckIn function for demo mode
    - Add onlyOwner modifier
    - Accept user address parameter
    - Perform same operations as checkIn for specified user
    - _Requirements: 11.1, 11.2_
  
  - [ ] 2.9 Write property tests for mockCheckIn
    - **Property 6: mockCheckIn behaves identically to checkIn for owner**
    - **Property 7: Only contract owner can call mockCheckIn**
    - **Validates: Requirements 11.1, 11.2**
  
  - [ ] 2.10 Implement executePenalty function
    - Accept array of inactive user addresses
    - Verify each user is inactive (>48 hours)
    - Calculate and deduct 10% penalty from each
    - Distribute penalties proportionally to active users
    - Emit PenaltyDistributed event
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 2.11 Write property tests for penalty mechanism
    - **Property 4: Penalty calculation is correct for inactive users**
    - **Property 5: Penalty distribution is proportional to active user balances**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  
  - [ ]* 2.12 Write unit tests for smart contract edge cases
    - Test zero balance withdrawal
    - Test deposit with zero value
    - Test penalty on exactly 48-hour boundary
    - Test multiple check-ins in sequence
    - _Requirements: 2.3, 5.1, 6.1, 12.3_

- [ ] 3. Checkpoint - Smart contract tests pass
  - Ensure all smart contract tests pass, ask the user if questions arise.

- [ ] 4. Implement backend API for AI verification
  - [ ] 4.1 Create /api/verify endpoint
    - Set up Next.js API route at app/api/verify/route.ts
    - Define request/response TypeScript interfaces
    - Implement request validation (image size, format)
    - _Requirements: 4.1_
  
  - [ ] 4.2 Implement image size validation
    - Check image size before processing
    - Reject images over 10MB with error message
    - _Requirements: 3.4_
  
  - [ ]* 4.3 Write property test for image size validation
    - **Property 8: Image size validation rejects oversized uploads**
    - **Validates: Requirements 3.4**
  
  - [ ] 4.3 Implement demo mode bypass logic
    - Check for x-demo-mode header
    - Return immediate success if header present
    - Skip OpenAI API call in demo mode
    - _Requirements: 4.5, 11.3_
  
  - [ ]* 4.4 Write property test for demo mode
    - **Property 9: Demo mode bypasses AI verification**
    - **Validates: Requirements 4.5, 11.3**
  
  - [ ] 4.5 Implement OpenAI GPT-4o integration
    - Set up OpenAI API client
    - Create prompt for fitness/reading scene detection
    - Send image to GPT-4o vision API
    - Parse response for valid/invalid determination
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ] 4.6 Implement 30-second timeout fallback
    - Wrap OpenAI call in timeout promise
    - Return success if timeout exceeds 30 seconds
    - Log timeout events for monitoring
    - _Requirements: 4.4_
  
  - [ ]* 4.7 Write property test for timeout fallback
    - **Property 10: AI verification timeout triggers fallback approval**
    - **Validates: Requirements 4.4**
  
  - [ ]* 4.8 Write unit tests for API endpoint
    - Test with valid fitness image
    - Test with valid reading image
    - Test with invalid image
    - Test demo mode header
    - Test timeout scenario
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 5. Implement utility functions and hooks
  - [ ] 5.1 Create wallet connection utilities in lib/utils.ts
    - Set up wagmi configuration
    - Create wallet connection helpers
    - Create contract interaction helpers
    - _Requirements: 1.2_
  
  - [ ] 5.2 Create custom React hooks
    - useWallet hook for wallet connection state
    - useContract hook for contract interactions
    - useCheckIn hook for check-in flow
    - useLeaderboard hook for leaderboard data
    - _Requirements: 1.2, 2.2, 3.3, 14.1_

- [ ] 6. Implement core UI components
  - [ ] 6.1 Create HeroStatus component
    - Display totalBalance with serif font
    - Show principal vs yield breakdown
    - Display checkInCount and currentStreak
    - Apply traditional aesthetic styling (black/white/red)
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 6.2 Write property tests for HeroStatus
    - **Property 14: Dashboard displays all user statistics**
    - **Property 22: Numeric displays use serif fonts**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
  
  - [ ] 6.3 Create CheckInRing component
    - Implement circular progress ring showing time until penalty
    - Add check-in button with click handler
    - Implement loading state during verification
    - Add seal stamp animation on success using Framer Motion
    - _Requirements: 3.1, 8.1_
  
  - [ ]* 6.4 Write property tests for CheckInRing
    - **Property 19: Seal stamp animation displays on successful check-in**
    - **Property 23: Check-in button triggers camera or file picker**
    - **Validates: Requirements 3.1, 8.1**
  
  - [ ] 6.5 Create WeekGrid component
    - Display exactly 7 days of check-in records
    - Show date and status for each day
    - Display red seal mark for completed days
    - Display empty/grayed state for missed days
    - Support scrolling for historical records
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 6.6 Write property test for WeekGrid
    - **Property 15: Weekly grid displays exactly 7 days**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**
  
  - [ ] 6.7 Create DuelCard component
    - Display leaderboard sorted by balance descending
    - Show truncated address, balance, and streak for each user
    - Highlight current user's position
    - Display penalty events feed
    - _Requirements: 14.1, 14.2, 14.4, 14.5_
  
  - [ ]* 6.8 Write property tests for DuelCard
    - **Property 16: Leaderboard sorts users by balance descending**
    - **Property 17: Leaderboard displays required user information**
    - **Property 18: Current user is highlighted in leaderboard**
    - **Validates: Requirements 14.1, 14.2, 14.4**

- [ ] 7. Implement global styling and theme
  - [ ] 7.1 Configure Tailwind with traditional aesthetic
    - Define CSS variables in globals.css: --bg-paper: #FFFFFF, --ink-black: #000000, --seal-red: #D43628
    - Configure Tailwind to use these colors
    - Set all border-radius to 0 globally
    - Configure serif font family for numeric displays
    - _Requirements: 8.3, 8.4, 7.4_
  
  - [ ]* 7.2 Write property tests for styling
    - **Property 20: Color palette matches traditional aesthetic**
    - **Property 21: All UI elements have zero border-radius**
    - **Validates: Requirements 8.3, 8.4**

- [ ] 8. Implement wallet connection and authentication
  - [ ] 8.1 Create wallet connection UI in layout.tsx
    - Add connect wallet button
    - Display connected address and balance
    - Add disconnect functionality
    - Handle connection errors
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 8.2 Write property tests for wallet connection
    - **Property 11: Wallet connection triggers wagmi connect**
    - **Property 12: Successful wallet connection displays address and balance**
    - **Property 13: Wallet disconnection resets state**
    - **Validates: Requirements 1.2, 1.3, 1.5**
  
  - [ ]* 8.3 Write unit tests for wallet error handling
    - Test connection rejection
    - Test no wallet installed
    - Test network mismatch
    - _Requirements: 1.4_

- [ ] 9. Implement check-in flow
  - [ ] 9.1 Implement image capture/selection in CheckInRing
    - Add button click handler to open camera or file picker
    - Display image preview after selection
    - Validate image before upload
    - _Requirements: 3.1, 3.2_
  
  - [ ]* 9.2 Write property tests for image handling
    - **Property 24: Image selection displays preview**
    - **Validates: Requirements 3.2**
  
  - [ ] 9.3 Implement image upload to verification API
    - Send image to /api/verify endpoint
    - Handle upload progress
    - Handle upload errors
    - _Requirements: 3.3, 3.5_
  
  - [ ]* 9.4 Write property test for image upload
    - **Property 25: Image submission uploads to verification API**
    - **Validates: Requirements 3.3**
  
  - [ ] 9.5 Implement contract checkIn call after verification
    - Call contract checkIn function on verification success
    - Handle transaction errors
    - Listen for CheckIn event
    - Update UI after event received
    - _Requirements: 5.3, 5.4_
  
  - [ ]* 9.6 Write property test for UI updates
    - **Property 27: Frontend updates balance after check-in event**
    - **Validates: Requirements 5.4, 7.5**

- [ ] 10. Checkpoint - Core functionality complete
  - Ensure all core features work: wallet connection, deposit, check-in, withdrawal
  - Ask the user if questions arise.

- [ ] 11. Implement demo mode features
  - [ ] 11.1 Add demo mode toggle via URL parameter
    - Check for ?demo=true in URL
    - Set isDemoMode state on page load
    - Persist demo mode in session storage
    - _Requirements: 11.4_
  
  - [ ]* 11.2 Write property test for demo mode activation
    - **Property 32: Demo mode can be toggled via URL parameter**
    - **Validates: Requirements 11.4**
  
  - [ ] 11.3 Add demo mode indicator UI
    - Display subtle indicator when demo mode is active
    - Style indicator with traditional aesthetic
    - _Requirements: 11.5_
  
  - [ ]* 11.4 Write property test for demo mode indicator
    - **Property 31: Demo mode indicator displays when active**
    - **Validates: Requirements 11.5**
  
  - [ ] 11.5 Implement mockCheckIn integration for owner
    - Add UI button for owner to trigger mockCheckIn
    - Call contract mockCheckIn function with user address
    - Handle owner-only access control
    - _Requirements: 11.1, 11.2_

- [ ] 12. Implement error handling and notifications
  - [ ] 12.1 Create error display component
    - Display transaction errors with user-friendly messages
    - Display network errors
    - Display verification rejection reasons
    - Display gas estimation errors with suggestions
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [ ]* 12.2 Write property test for error display
    - **Property 29: Error messages are displayed for all failure cases**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4**
  
  - [ ] 12.3 Implement console error logging
    - Log all errors to console with details
    - Include error type, message, and stack trace
    - _Requirements: 13.5_
  
  - [ ]* 12.4 Write property test for error logging
    - **Property 30: All errors are logged to console**
    - **Validates: Requirements 13.5**
  
  - [ ] 12.5 Create penalty notification system
    - Listen for PenaltyDistributed events
    - Display notifications to penalized users
    - Display notifications to rewarded users
    - _Requirements: 6.5_
  
  - [ ]* 12.6 Write property test for penalty notifications
    - **Property 28: Penalty events display notifications**
    - **Validates: Requirements 6.5**

- [ ] 13. Implement main page integration
  - [ ] 13.1 Create page.tsx with all components
    - Import and arrange HeroStatus, CheckInRing, WeekGrid, DuelCard
    - Implement state management for user data
    - Connect components to wallet and contract hooks
    - Handle loading states
    - _Requirements: 1.1, 7.1, 9.1, 14.1_
  
  - [ ] 13.2 Implement real-time updates
    - Listen for contract events (CheckIn, Deposit, Withdrawal, PenaltyDistributed)
    - Update UI state when events are received
    - Update leaderboard rankings in real-time
    - _Requirements: 7.5, 14.3_
  
  - [ ]* 13.3 Write property tests for real-time updates
    - **Property 34: Leaderboard updates in real-time on rank changes**
    - **Property 35: Weekly grid updates after animation completes**
    - **Validates: Requirements 14.3, 8.5**

- [ ] 14. Implement PWA features
  - [ ] 14.1 Configure manifest.json
    - Set app name, icons, theme colors
    - Configure display mode to fullscreen
    - Set start_url and scope
    - _Requirements: 10.1, 10.3_
  
  - [ ] 14.2 Register service worker
    - Create service worker for offline capability
    - Register service worker in layout.tsx
    - Handle service worker updates
    - _Requirements: 10.2_
  
  - [ ] 14.3 Optimize for mobile
    - Ensure responsive design for all components
    - Add touch event handlers to interactive elements
    - Test on mobile viewport sizes
    - _Requirements: 10.4, 10.5_
  
  - [ ]* 14.4 Write property test for touch support
    - **Property 33: Touch gestures are supported on interactive elements**
    - **Validates: Requirements 10.5**

- [ ] 15. Implement withdrawal functionality
  - [ ] 15.1 Add withdrawal UI to HeroStatus
    - Display available withdrawal amount
    - Add withdraw button
    - Show confirmation dialog
    - _Requirements: 12.1_
  
  - [ ] 15.2 Implement withdraw contract call
    - Call contract withdraw function
    - Handle transaction confirmation
    - Update UI after successful withdrawal
    - Handle withdrawal errors
    - _Requirements: 12.2, 12.5_
  
  - [ ]* 15.3 Write unit tests for withdrawal flow
    - Test successful withdrawal
    - Test withdrawal with zero balance
    - Test withdrawal transaction failure
    - _Requirements: 12.2, 12.3, 12.4, 12.5_

- [ ] 16. Final integration and testing
  - [ ]* 16.1 Write end-to-end integration tests
    - Test full user journey: connect → deposit → check-in → withdraw
    - Test demo mode flow
    - Test penalty mechanism
    - Test leaderboard updates
    - _Requirements: All_
  
  - [ ] 16.2 Deploy smart contract to testnet
    - Deploy ZhengDao contract to testnet (e.g., Sepolia)
    - Verify contract on block explorer
    - Update frontend with contract address
    - _Requirements: 2.3_
  
  - [ ] 16.3 Test on actual mobile devices
    - Test PWA installation
    - Test camera access
    - Test touch interactions
    - Test fullscreen mode
    - _Requirements: 10.3, 10.4, 10.5_

- [ ] 17. Final checkpoint - All tests pass
  - Ensure all unit tests and property tests pass
  - Verify demo mode works for hackathon presentation
  - Confirm all requirements are met
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Demo mode features are critical for hackathon presentation
- Smart contract should be deployed to testnet before final testing
