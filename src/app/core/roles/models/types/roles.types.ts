import { ROLES_AVAILABLE } from "@core/roles/models/constants/roles.constants";


export type Roles = typeof ROLES_AVAILABLE[keyof typeof ROLES_AVAILABLE]