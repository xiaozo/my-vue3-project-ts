declare global {

    declare namespace MODEL {
        ///用户
        interface UserInfo {
            userId: number | string;
            userName: string;
            nickName?: string;
            remark?: string;
            deptId?: number;
            phonenumber?: string;
            sex?: string;
            avatar: string;
            dept?: DeptInfo;
            roles?: RoleInfo[];
            admin?: boolean;
        }

        ///部门
        interface DeptInfo {
            deptId: number;
            parentId: number;
            ancestors: string;
            deptName: string;
            orderNum: number;
        }

        ///角色
        interface RoleInfo {
            roleId: number;
            roleName: string;
            admin: boolean;
        }
    }
}

export { }