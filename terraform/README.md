# Terraform

Manages the two pieces of Cloudflare configuration that sit *around* the Worker:

| Resource | What it is |
|---|---|
| `cloudflare_workers_custom_domain.resume` | binds `resume.austinhenry.dev` to the `austin-resume` Worker |
| `cloudflare_ruleset.apex_redirect` | Single Redirect: `austinhenry.dev` → `https://resume.austinhenry.dev` (301) |

The Worker and its assets are **not** managed here — `wrangler deploy` (run by
`.github/workflows/deploy.yml`) creates and updates them. Deploy at least once before
applying, because the custom-domain binding needs the Worker to exist.

## State

State is local and git-ignored on purpose: one operator, two resources, no shared
backend to secure. `terraform.tfstate` and `terraform.tfvars` must never be committed
(`.gitignore` enforces this). The provider lock file *is* committed, for both
`darwin_arm64` (laptop) and `linux_amd64` (CI).

## CI

`.github/workflows/checks.yml` runs `terraform fmt -check` and `terraform validate` on
every pull request and push. It never plans or applies; changes are applied by hand.

## Token

A Cloudflare API token with:

- Account → Workers Scripts: Edit
- Zone → Workers Routes: Edit (custom domains)
- Zone → Single Redirect: Edit (if your token UI lacks it, Zone → Zone Rulesets: Edit)
- Zone → Zone: Read

scoped to this account and the `austinhenry.dev` zone. Export it; do not write it down:

```sh
export TF_VAR_cloudflare_api_token="..."
```

## First run (one time)

The custom domain already existed before Terraform managed it, so it is imported
rather than created. The redirect is new.

```sh
cd terraform
cp terraform.tfvars.example terraform.tfvars   # fill in the ids and hostnames
terraform init
terraform import cloudflare_workers_custom_domain.resume "<account_id>/<domain_id>"
terraform plan        # expect: 0 to change for the domain, 1 to add for the redirect
terraform apply
```

`<domain_id>` comes from `GET /accounts/<account_id>/workers/domains?hostname=resume.austinhenry.dev`.

## Day to day

```sh
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```
