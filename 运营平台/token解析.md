## 解析 token 格式

- [解析网站](https://jwt.io/)
- 将 token 中 删掉 bearer，拷贝进网站

```javascript
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiNDA1ZWNhYmZkMGY5ZTFkNGE4YjZjZGY3YmU5M2E5YzkiLCJyb2xlIjpbIlBNU19BRE1JTiIsIlRFTkFOVF9BRE1JTiJdLCJ1c2VyX25hbWUiOiJhZG1pbiIsImN1cnJlbnRUZW5hbnQiOiIwMDAwMDAwMDAwMCIsInNjb3BlIjpbIm9wZW5pZCJdLCJuYW1lIjoi566h55CG5ZGYIiwicGVybWlzc2lvbiI6WyJFTEVfUE1TX2FjY2Vzc1Rva2VuX0FMTCIsIkVMRV9QTVNfYXBwX0FMTCIsIkVMRV9QTVNfYXJjaGl0ZWN0dXJlX0FMTCIsIkVMRV9QTVNfYmFsYW5jZV9BTEwiLCJFTEVfUE1TX2NoYW5uZWxQYXJhbXNfQUxMIiwiRUxFX1BNU19jaGFubmVsX0FMTCIsIkVMRV9QTVNfY2xpZW50X0FMTCIsIkVMRV9QTVNfZGF0YV9BTEwiLCJFTEVfUE1TX2RpY3RBcmVhX0FMTCIsIkVMRV9QTVNfZGljdENvbW1vbl9BTEwiLCJFTEVfUE1TX2VsZW1lbnRfQUxMIiwiRUxFX1BNU19mbG93X0FMTCIsIkVMRV9QTVNfZ3JvdXBfQUxMIiwiRUxFX1BNU19pbnZvaWNlX0FMTCIsIkVMRV9QTVNfbWVudUdyb3VwX0FMTCIsIkVMRV9QTVNfbWVudVBlcm1pc3NfQUxMIiwiRUxFX1BNU19tZW51X0FMTCIsIkVMRV9QTVNfbWVyY2hhbnRfQUxMIiwiRUxFX1BNU19tZXRob2RfQUxMIiwiRUxFX1BNU19vcGVyYXRpb25QZXJtaXNzX0FMTCIsIkVMRV9QTVNfb3BlcmF0aW9uX0FMTCIsIkVMRV9QTVNfcGFnZUVsZW1lbnRQZXJtaXNzX0FMTCIsIkVMRV9QTVNfcGF5QWNjb3VudFNldF9BTEwiLCJFTEVfUE1TX3Blcm1pc3Npb25fQUxMIiwiRUxFX1BNU19wb2xpY3lfQUxMIiwiRUxFX1BNU19wcm92aWRlcl9BTEwiLCJFTEVfUE1TX3JpZ2h0X0FMTCIsIkVMRV9QTVNfcm9sZV9BTEwiLCJFTEVfUE1TX3NlY3VyaXR5X0FMTCIsIkVMRV9QTVNfc2VuZFJlY29yZF9BTEwiLCJFTEVfUE1TX3Ntc0FwaUtleV9BTEwiLCJFTEVfUE1TX3Ntc1JlY29yZF9BTEwiLCJFTEVfUE1TX3Ntc1N1cHBsaWVyX0FMTCIsIkVMRV9QTVNfc21zVGVtcGxhdGVfQUxMIiwiRUxFX1BNU19zdXBwbGllclRlbXBsYXRlX0FMTCIsIkVMRV9QTVNfdGVuYW50UmlnaHRfQUxMIiwiRUxFX1BNU190ZW5hbnRfQUxMIiwiRUxFX1BNU191cGxpbmtTbXNfQUxMIiwiRUxFX1BNU191c2VyR3JvdXBfQUxMIiwiRUxFX1BNU191c2VyTG9nX0FMTCIsIkVMRV9QTVNfdXNlcl9BTEwiLCJFTEVfUE1TX3dpdGhkcmF3X0FMTCIsIk1FTlVfUE1TX0FMTCJdLCJleHAiOjE1ODc0NjA3ODIsImlhdCI6MTU4NzQ1MzU4MiwianRpIjoiMTI0NTY4MTgtNTIxYi00MzgxLWJmZTEtYWYwOWJkYmVmNDc1IiwidGVuYW50IjpbIjAwMDAwMDAwMDAwIiwiY2FlYzJlOGVhNmIiXSwiY2xpZW50X2lkIjoid2ViX2FwcCJ9.yMZbxs89n3DXz1JecSILCt0KgrzpL4aFnpE-fpGjVCJ4JURs6uDqviYxrZJ-q0z9OzMTiHpQpCPTFad60IypSj9kCkV-zEIo-D6bWZaW0SKXhs7Rx1tGJL1Sp-4wz9BgatZCu5RAXjGmTcHZLwdy7p6DrJ4tgp8MjYoBXDMoPfzYjnshxwoalVkDEUAZG6y8GP4YOt4ywHfAwEzN2w8v2rOlTOAcW_lRJpurAhMqusnjZxv9grTv2YgWUodR3b5pRUHLPPfnFU-hWCjFYMD10isICJNrTV61Bndd0MM4E7xuedwz48bTarHcUSrXmdbp7uyHoOIOb7ijc3fGbXfdXQ
```

转换为

```javascript
{
  "code": "405ecabfd0f9e1d4a8b6cdf7be93a9c9",
  "role": [
    "PMS_ADMIN",
    "TENANT_ADMIN"
  ],
  "user_name": "admin",
  "currentTenant": "00000000000",
  "scope": [
    "openid"
  ],
  "name": "管理员",
  "permission": [
    "ELE_PMS_accessToken_ALL",
    "ELE_PMS_app_ALL",
    "ELE_PMS_architecture_ALL",
    "ELE_PMS_balance_ALL",
    "ELE_PMS_channelParams_ALL",
    "ELE_PMS_channel_ALL",
    "ELE_PMS_client_ALL",
    "ELE_PMS_data_ALL",
    "ELE_PMS_dictArea_ALL",
    "ELE_PMS_dictCommon_ALL",
    "ELE_PMS_element_ALL",
    "ELE_PMS_flow_ALL",
    "ELE_PMS_group_ALL",
    "ELE_PMS_invoice_ALL",
    "ELE_PMS_menuGroup_ALL",
    "ELE_PMS_menuPermiss_ALL",
    "ELE_PMS_menu_ALL",
    "ELE_PMS_merchant_ALL",
    "ELE_PMS_method_ALL",
    "ELE_PMS_operationPermiss_ALL",
    "ELE_PMS_operation_ALL",
    "ELE_PMS_pageElementPermiss_ALL",
    "ELE_PMS_payAccountSet_ALL",
    "ELE_PMS_permission_ALL",
    "ELE_PMS_policy_ALL",
    "ELE_PMS_provider_ALL",
    "ELE_PMS_right_ALL",
    "ELE_PMS_role_ALL",
    "ELE_PMS_security_ALL",
    "ELE_PMS_sendRecord_ALL",
    "ELE_PMS_smsApiKey_ALL",
    "ELE_PMS_smsRecord_ALL",
    "ELE_PMS_smsSupplier_ALL",
    "ELE_PMS_smsTemplate_ALL",
    "ELE_PMS_supplierTemplate_ALL",
    "ELE_PMS_tenantRight_ALL",
    "ELE_PMS_tenant_ALL",
    "ELE_PMS_uplinkSms_ALL",
    "ELE_PMS_userGroup_ALL",
    "ELE_PMS_userLog_ALL",
    "ELE_PMS_user_ALL",
    "ELE_PMS_withdraw_ALL",
    "MENU_PMS_ALL"
  ],
  "exp": 1587460782,
  "iat": 1587453582,
  "jti": "12456818-521b-4381-bfe1-af09bdbef475",
  "tenant": [
    "00000000000",
    "caec2e8ea6b"
  ],
  "client_id": "web_app"
}
```

其中 exp 字段，表示为 过期时间；
