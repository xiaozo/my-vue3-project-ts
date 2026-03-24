declare global {

    declare namespace MODEL {
        ///用户
        interface UserInfo {
            remark: string;
            userId: number;
            deptId: number;
            userName: string;
            nickName: string;
            phonenumber: string;
            sex: string;
            avatar: string;
            dept: DeptInfo;
            roles: RoleInfo[];
            admin: boolean;
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