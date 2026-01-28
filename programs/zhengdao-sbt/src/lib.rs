use anchor_lang::prelude::*;

declare_id!("zhengD1111111111111111111111111111111111111");

#[program]
pub mod zhengdao_sbt {
    use super::*;

    /// 初始化SBT程序
    /// 创建全局配置账户，设置管理员权限
    pub fn initialize(
        ctx: Context<Initialize>,
        authority: Pubkey,
    ) -> Result<()> {
        let sbt_config = &mut ctx.accounts.sbt_config;
        sbt_config.authority = authority;
        sbt_config.bump = ctx.bumps.sbt_config;

        msg!("SBT Program initialized with authority: {}", authority);
        Ok(())
    }

    /// 铸造SBT
    /// 为用户创建新的灵魂绑定代币，记录等级和持续天数
    pub fn mint_sbt(
        ctx: Context<MintSBT>,
        level: u8,
        days: u32,
        metadata_uri: String,
    ) -> Result<()> {
        let sbt = &mut ctx.accounts.sbt;
        let clock = Clock::get()?;

        // 验证level必须在1-6之间
        require!(
            level >= 1 && level <= 6,
            ErrorCode::InvalidLevel
        );

        // 设置SBT数据
        sbt.owner = ctx.accounts.owner.key();
        sbt.level = level;
        sbt.days = days;
        sbt.minted_at = clock.unix_timestamp;
        sbt.metadata_uri = metadata_uri;
        sbt.bump = ctx.bumps.sbt;

        // 发出事件
        emit!(SBTMintedEvent {
            owner: sbt.owner,
            level,
            timestamp: sbt.minted_at,
        });

        msg!(
            "SBT minted for owner: {}, level: {}, days: {}",
            sbt.owner,
            level,
            days
        );

        Ok(())
    }

    /// 更新SBT元数据
    /// 仅管理员可以调用，用于更新元数据URI
    pub fn update_metadata(
        ctx: Context<UpdateMetadata>,
        new_metadata_uri: String,
    ) -> Result<()> {
        let sbt_config = &ctx.accounts.sbt_config;
        let sbt = &mut ctx.accounts.sbt;

        // 验证调用者是管理员
        require!(
            ctx.accounts.authority.key() == sbt_config.authority,
            ErrorCode::Unauthorized
        );

        sbt.metadata_uri = new_metadata_uri;

        msg!("Metadata updated for SBT owned by: {}", sbt.owner);
        Ok(())
    }

    /// 获取SBT账户信息（只读）
    /// 前端可以使用此指令查询SBT详情
    pub fn get_sbt(ctx: Context<GetSBT>) -> Result<SBTInfo> {
        let sbt = &ctx.accounts.sbt;

        Ok(SBTInfo {
            owner: sbt.owner,
            level: sbt.level,
            days: sbt.days,
            minted_at: sbt.minted_at,
            metadata_uri: sbt.metadata_uri.clone(),
        })
    }
}

// === 指令上下文 ===

/// Initialize指令的账户结构
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + SbtConfig::SPACE,
        seeds = [b"sbt_config"],
        bump
    )]
    pub sbt_config: Account<'info, SbtConfig>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// MintSBT指令的账户结构
#[derive(Accounts)]
pub struct MintSBT<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + Sbt::SPACE,
        seeds = [
            b"sbt",
            owner.key().as_ref(),
            &level.to_le_bytes()
        ],
        bump
    )]
    pub sbt: Account<'info, Sbt>,

    /// SBT所有者（接收者）
    pub owner: Signer<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// UpdateMetadata指令的账户结构
#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    #[account(
        mut,
        seeds = [b"sbt_config"],
        bump = sbt_config.bump
    )]
    pub sbt_config: Account<'info, SbtConfig>,

    #[account(
        mut,
        seeds = [
            b"sbt",
            sbt.owner.as_ref(),
            &sbt.level.to_le_bytes()
        ],
        bump = sbt.bump
    )]
    pub sbt: Account<'info, Sbt>,

    pub authority: Signer<'info>,
}

/// GetSBT指令的账户结构
#[derive(Accounts)]
pub struct GetSBT<'info> {
    #[account(
        seeds = [
            b"sbt",
            sbt.owner.as_ref(),
            &sbt.level.to_le_bytes()
        ],
        bump = sbt.bump
    )]
    pub sbt: Account<'info, Sbt>,
}

// === 数据结构 ===

/// SBT程序配置账户
#[account]
pub struct SbtConfig {
    pub authority: Pubkey,
    pub bump: u8,
}

impl SbtConfig {
    pub const SPACE: usize = 32 + 1; // authority (32) + bump (1)
}

/// SBT账户结构
/// 存储每个用户的灵魂绑定代币信息
#[account]
pub struct Sbt {
    pub owner: Pubkey,        // SBT所有者
    pub level: u8,            // 等级 (1-6)
    pub days: u32,            // 持续天数
    pub minted_at: i64,       // 铸造时间戳
    pub metadata_uri: String, // 元数据URI
    pub bump: u8,             // PDA bump seed
}

impl Sbt {
    pub const SPACE: usize = 32 + 1 + 4 + 8 + 4 + 256 + 1;
    // owner(32) + level(1) + days(4) + minted_at(8) +
    // metadata_uri长度前缀(4) + metadata_uri最大长度(256) + bump(1)
}

/// SBT信息返回结构（用于get_sbt指令）
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct SBTInfo {
    pub owner: Pubkey,
    pub level: u8,
    pub days: u32,
    pub minted_at: i64,
    pub metadata_uri: String,
}

// === 事件 ===

/// SBT铸造事件
/// 前端可以监听此事件来实时更新UI
#[event]
pub struct SBTMintedEvent {
    pub owner: Pubkey,
    pub level: u8,
    pub timestamp: i64,
}

// === 错误码 ===

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid level. Level must be between 1 and 6.")]
    InvalidLevel,

    #[msg("Not authorized to perform this action.")]
    Unauthorized,

    #[msg("SBT already exists for this owner and level.")]
    SbtAlreadyExists,

    #[msg("Metadata URI is too long. Maximum 256 characters.")]
    MetadataUriTooLong,
}
