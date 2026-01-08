## Integration tests

### For Entra

Get an entra token

```bash
az login
az account get-access-token --query accessToken -o tsv
```

Copy the token, create an `.env.local` file and put it in `TEST_INTEG_ENTRA_VALID_TOKEN` variable.
