# Requirements Document

## Introduction

证道 (ZhengDao) 是一个基于区块链的打卡激励系统，通过智能合约管理用户存款和收益分配，结合 AI 图片验证确保打卡真实性。系统采用 PVP 机制，惩罚不活跃用户并奖励坚持打卡的用户，以游戏化方式激励用户养成良好习惯。

## Glossary

- **System**: 证道打卡激励系统的整体应用
- **Smart_Contract**: 部署在区块链上的 ZhengDao Solidity 合约
- **User**: 连接钱包并参与打卡挑战的用户
- **Check_In**: 用户提交图片并通过验证的打卡行为
- **AI_Verifier**: 使用 OpenAI GPT-4o 进行图片场景识别的验证服务
- **Frontend**: 基于 Next.js 的 PWA 前端应用
- **Active_User**: 在过去 48 小时内完成打卡的用户
- **Inactive_User**: 超过 48 小时未打卡的用户
- **Virtual_Yield**: 每次打卡获得的 0.5% 虚拟收益
- **Penalty**: 不活跃用户被扣除的 10% 本金
- **Demo_Mode**: 用于演示的特殊模式，绕过正常验证流程

## Requirements

### Requirement 1: 用户钱包连接与身份管理

**User Story:** 作为用户，我想连接我的加密钱包，以便参与区块链打卡挑战。

#### Acceptance Criteria

1. WHEN a user visits the application, THE Frontend SHALL display a wallet connection interface
2. WHEN a user clicks the connect button, THE Frontend SHALL initiate wallet connection using wagmi
3. WHEN wallet connection succeeds, THE System SHALL display the user's wallet address and balance
4. WHEN wallet connection fails, THE System SHALL display an error message and allow retry
5. WHEN a user disconnects their wallet, THE System SHALL clear the session and return to the initial state

### Requirement 2: 智能合约存款与挑战参与

**User Story:** 作为用户，我想通过智能合约存入资金，以便开始打卡挑战并有机会获得收益。

#### Acceptance Criteria

1. WHEN a user initiates a deposit, THE Frontend SHALL prompt the user to specify the deposit amount
2. WHEN a user confirms the deposit, THE Frontend SHALL call the Smart_Contract deposit function
3. WHEN the deposit transaction succeeds, THE Smart_Contract SHALL record the user's principal amount and timestamp
4. WHEN the deposit transaction fails, THE System SHALL display an error message with transaction details
5. THE Smart_Contract SHALL emit a Deposit event containing user address, amount, and timestamp

### Requirement 3: 打卡提交与图片上传

**User Story:** 作为用户，我想提交打卡图片，以便证明我完成了健身或读书活动。

#### Acceptance Criteria

1. WHEN a user clicks the check-in button, THE Frontend SHALL open the device camera or file picker
2. WHEN a user selects an image, THE Frontend SHALL display a preview of the selected image
3. WHEN a user confirms submission, THE Frontend SHALL upload the image to the verification API
4. WHEN the image size exceeds 10MB, THE System SHALL reject the upload and display a size limit error
5. WHEN the upload fails, THE System SHALL display an error message and allow retry

### Requirement 4: AI 图片验证

**User Story:** 作为系统管理员，我想使用 AI 验证打卡图片的真实性，以防止用户作弊。

#### Acceptance Criteria

1. WHEN the verification API receives an image, THE AI_Verifier SHALL analyze the image using OpenAI GPT-4o
2. WHEN the image contains fitness or reading scenes, THE AI_Verifier SHALL return a success response
3. WHEN the image does not contain valid scenes, THE AI_Verifier SHALL return a rejection response with reason
4. WHEN AI verification takes longer than 30 seconds, THE System SHALL automatically approve the check-in (fallback mechanism)
5. WHERE Demo_Mode is enabled, THE AI_Verifier SHALL automatically approve all submissions without actual verification

### Requirement 5: 虚拟收益计算与记录

**User Story:** 作为用户，我想每次打卡获得虚拟收益，以便看到我的资产增长。

#### Acceptance Criteria

1. WHEN a check-in is verified successfully, THE Smart_Contract SHALL calculate 0.5% of the user's current balance as Virtual_Yield
2. WHEN Virtual_Yield is calculated, THE Smart_Contract SHALL add it to the user's total balance
3. WHEN the balance is updated, THE Smart_Contract SHALL emit a CheckIn event with the new balance
4. THE Frontend SHALL display the updated balance immediately after check-in
5. THE Smart_Contract SHALL record the check-in timestamp for PVP mechanism calculation

### Requirement 6: PVP 惩罚机制

**User Story:** 作为活跃用户，我想获得不活跃用户的罚金，以便获得额外收益激励。

#### Acceptance Criteria

1. WHEN a user has not checked in for 48 hours, THE Smart_Contract SHALL mark the user as Inactive_User
2. WHEN an Inactive_User is identified, THE Smart_Contract SHALL deduct 10% from their principal balance as Penalty
3. WHEN Penalty is collected, THE Smart_Contract SHALL distribute it proportionally among all Active_Users based on their balance
4. WHEN distribution occurs, THE Smart_Contract SHALL emit a PenaltyDistributed event with affected users and amounts
5. THE Frontend SHALL display penalty notifications to both penalized and rewarded users

### Requirement 7: 用户资产看板显示

**User Story:** 作为用户，我想查看我的资产状态，以便了解我的本金、收益和打卡记录。

#### Acceptance Criteria

1. WHEN a user views the dashboard, THE Frontend SHALL display the user's total balance
2. WHEN displaying balance, THE Frontend SHALL show principal amount and accumulated yield separately
3. WHEN displaying statistics, THE Frontend SHALL show total check-in count and current streak
4. THE Frontend SHALL use serif fonts for numerical displays to match the traditional aesthetic
5. THE Frontend SHALL update all statistics in real-time after each check-in

### Requirement 8: 打卡动画与视觉反馈

**User Story:** 作为用户，我想看到具有中国传统美学的打卡动画，以便获得愉悦的使用体验。

#### Acceptance Criteria

1. WHEN a check-in succeeds, THE Frontend SHALL display a red seal stamp animation
2. WHEN the animation plays, THE Frontend SHALL use Framer Motion for smooth transitions
3. THE Frontend SHALL use the color palette: white background (#FFFFFF), black ink (#000000), and seal red (#D43628)
4. THE Frontend SHALL apply zero border-radius to all UI elements for sharp edges
5. WHEN animations complete, THE Frontend SHALL update the weekly check-in grid with the new record

### Requirement 9: 七日打卡记录展示

**User Story:** 作为用户，我想查看最近七天的打卡记录，以便追踪我的坚持情况。

#### Acceptance Criteria

1. WHEN a user views the weekly grid, THE Frontend SHALL display the last 7 days of check-in records
2. WHEN displaying each day, THE Frontend SHALL show the date and check-in status (completed or missed)
3. WHEN a day has a successful check-in, THE Frontend SHALL display a red seal mark
4. WHEN a day is missed, THE Frontend SHALL display an empty or grayed-out state
5. THE Frontend SHALL scroll or paginate to show historical records beyond 7 days

### Requirement 10: PWA 移动端体验

**User Story:** 作为移动端用户，我想将应用添加到主屏幕，以便像原生应用一样使用。

#### Acceptance Criteria

1. THE Frontend SHALL include a valid manifest.json file with app metadata
2. THE Frontend SHALL register a service worker for offline capability
3. WHEN a user adds the app to home screen, THE System SHALL launch in fullscreen mode
4. THE Frontend SHALL be responsive and optimized for mobile viewport sizes
5. THE Frontend SHALL support touch gestures for all interactive elements

### Requirement 11: 演示模式与后门功能

**User Story:** 作为演示者，我想使用特殊功能快速展示系统，以便在 hackathon 中高效演示。

#### Acceptance Criteria

1. WHERE Demo_Mode is enabled, THE Smart_Contract SHALL provide a mockCheckIn function callable only by the contract owner
2. WHEN mockCheckIn is called, THE Smart_Contract SHALL record a check-in without requiring image verification
3. WHERE the API receives x-demo-mode header, THE AI_Verifier SHALL bypass actual verification and return success
4. THE Frontend SHALL provide a hidden UI toggle for enabling Demo_Mode (accessible via specific gesture or URL parameter)
5. WHEN Demo_Mode is active, THE Frontend SHALL display a subtle indicator to show the mode is enabled

### Requirement 12: 资金提取功能

**User Story:** 作为用户，我想提取我的资金，以便在完成挑战后获得我的本金和收益。

#### Acceptance Criteria

1. WHEN a user requests withdrawal, THE Frontend SHALL display the available withdrawal amount
2. WHEN a user confirms withdrawal, THE Frontend SHALL call the Smart_Contract withdraw function
3. WHEN withdrawal is processed, THE Smart_Contract SHALL transfer the full balance to the user's wallet
4. WHEN withdrawal succeeds, THE Smart_Contract SHALL reset the user's balance to zero
5. WHEN withdrawal fails, THE System SHALL display an error message with transaction details

### Requirement 13: 错误处理与用户反馈

**User Story:** 作为用户，我想在操作失败时获得清晰的错误信息，以便了解问题并采取行动。

#### Acceptance Criteria

1. WHEN any blockchain transaction fails, THE Frontend SHALL display the error reason in user-friendly language
2. WHEN network connection is lost, THE System SHALL display a connection error message
3. WHEN AI verification fails, THE System SHALL display the rejection reason (e.g., "图片未包含健身或读书场景")
4. WHEN gas estimation fails, THE Frontend SHALL suggest increasing gas limit or checking wallet balance
5. THE System SHALL log all errors to the console for debugging purposes

### Requirement 14: 论剑卡片与用户排名

**User Story:** 作为用户，我想查看其他用户的打卡情况，以便与他们竞争并保持动力。

#### Acceptance Criteria

1. WHEN a user views the leaderboard, THE Frontend SHALL display top users ranked by total balance
2. WHEN displaying each user, THE Frontend SHALL show wallet address (truncated), balance, and check-in streak
3. WHEN a user's rank changes, THE Frontend SHALL update the display in real-time
4. THE Frontend SHALL highlight the current user's position in the leaderboard
5. THE Frontend SHALL display penalty events in the leaderboard feed (who got penalized, who received rewards)
