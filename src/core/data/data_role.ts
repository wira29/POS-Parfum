import { TMultiSelect } from "../interface/input-interface"

export const DataRoleSelect:TMultiSelect = [
    {value: 'manager', label: 'Manajer'},
    {value: 'auditor', label: 'Auditor'},
    {value: 'warehouse', label: 'Admin Gudang'},
    {value: 'outlet', label: 'Admin Outlet'},
    {value: 'cashier', label: 'Kasir'},
    {value: 'owner', label: 'Owner'},
]

export const DataRole = DataRoleSelect.length ? DataRoleSelect.map(item => (item.value)) : ['manager']