declare namespace API {

  export interface Response {
    code: number;
    data: any;
    message: string;
  }

  export interface Userinfo {
      nickname: string;
      avatar: string;
      userid: string;
      email: string;
      signature: string;
      title: string;
      group: string;
      notifies: number;
      unread: number;
      geographic: {
        country: {
          code?: string;
          name: string;
        };
        province: {
          name: string;
          code: number;
        };
        city: {
          name: string;
          code: number;
        };
        area: {
          name: string;
          code: number;
        };
        address: string;
      };
      phone: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }
}
