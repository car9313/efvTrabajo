export class SecuritySettings {
  constructor(public password_settings?: IPasswordSettings,
              public lock_out_settings?: {
                max_attempts: number,
                lock_out_time: number,
                interval: number
              },
              public user_settings?: {},
              public access_token_expire_time?: number,
              public session_expire_time?: number) {
    this.password_settings = password_settings || {
      valid_days: 90,
      history_min_count: 24,
      password_default_value: '',
      min_length: 8,
      requires_uppercase: true,
      requires_lowercase: true,
      requires_digits: true,
      requires_special_chars: true,
      empty: false,
    };
    this.lock_out_settings = lock_out_settings || {
      max_attempts: 5,
      lock_out_time: 10,
      interval: 5,
    };
    this.user_settings = user_settings || {};
    this.access_token_expire_time = 10;
  }
}

export interface IPasswordSettings {
  valid_days: number;
  history_min_count: number;
  password_default_value: string;
  min_length: number;
  requires_uppercase: boolean;
  requires_lowercase: boolean;
  requires_digits: boolean;
  requires_special_chars: boolean;
  empty: boolean;
}

export class PasswordSettings implements IPasswordSettings {
  valid_days: number;
  history_min_count: number;
  password_default_value: string;
  min_length: number;
  requires_uppercase: boolean;
  requires_lowercase: boolean;
  requires_digits: boolean;
  requires_special_chars: boolean;
  empty: boolean;

  constructor(opt?: IPasswordSettings) {
    this.valid_days = opt && opt.valid_days ? opt.valid_days : 90;
    this.history_min_count = opt && opt.history_min_count ? opt.history_min_count : 24;
    this.password_default_value = opt && opt.password_default_value ? opt.password_default_value : '';
    this.min_length = opt && opt.min_length ? opt.min_length : 8;
    this.requires_uppercase = opt && opt.requires_uppercase ? opt.requires_uppercase : true;
    this.requires_lowercase = opt && opt.requires_lowercase ? opt.requires_lowercase : true;
    this.requires_digits = opt && opt.requires_digits ? opt.requires_digits : true;
    this.requires_special_chars = opt && opt.requires_special_chars ? opt.requires_special_chars : true;
    this.empty = opt && opt.empty ? opt.empty : false;
  }
}
