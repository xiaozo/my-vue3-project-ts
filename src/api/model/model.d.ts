declare global {
 
    declare namespace MODEL {
        interface UserInfo {
            createBy: string;
            createTime: string;
            updateBy: string | null;
            updateTime: string | null;
            remark: string;
            userId: number;
            deptId: number;
            userName: string;
            nickName: string;
            email: string;
            phonenumber: string;
            sex: string;
            avatar: string;
            status: string;
            delFlag: string;
            loginIp: string;
            loginDate: string;
            pwdUpdateDate: string;
            dept: DeptInfo;
            roles: RoleInfo[];
            roleIds: null;
            postIds: null;
            roleId: null;
            admin: boolean;
        }

        interface DeptInfo {
            createBy: string | null;
            createTime: string | null;
            updateBy: string | null;
            updateTime: string | null;
            remark: string | null;
            deptId: number;
            parentId: number;
            ancestors: string;
            deptName: string;
            orderNum: number;
            leader: string;
            phone: string | null;
            email: string | null;
            status: string;
            delFlag: string | null;
            parentName: string | null;
            children: any[];
        }

        interface RoleInfo {
            createBy: string | null;
            createTime: string | null;
            updateBy: string | null;
            updateTime: string | null;
            remark: string | null;
            roleId: number;
            roleName: string;
            roleKey: string;
            roleSort: number;
            dataScope: string;
            menuCheckStrictly: boolean;
            deptCheckStrictly: boolean;
            status: string;
            delFlag: string | null;
            flag: boolean;
            menuIds: null;
            deptIds: null;
            permissions: null;
            admin: boolean;
        }
    }
}

export { }