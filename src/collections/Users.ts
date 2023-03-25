import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    plural: "用户",
    singular: "用户",
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      "email",
      "userName",
      "isAdmin",
    ]
  },
  access: {
    read: (req: {req:{user: any}})=>{
      return req.req.user?.isAdmin
    },
    readVersions: (req: {req:{user: any}})=>{
      return req.req.user?.isAdmin
    },
    update: (req: {req:{user: any}})=>{
      return req.req.user?.isAdmin
    },
    delete: (req: {req:{user: any}})=>{
      return req.req.user?.isAdmin
    },
    unlock: (req: {req:{user: any}})=>{
      return req.req.user?.isAdmin
    }
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: "userName",
      label: "用户名",
      type: "text",
      required: false,
    },
    {
      name: "isAdmin",
      label: "是否是管理员",
      admin: {
        description: "只有管理员可以操作\"用户\"集合",
      },
      type: "checkbox",
      defaultValue: false
    }
  ],
};

export default Users;