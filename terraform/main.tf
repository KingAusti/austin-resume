provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# resume.austinhenry.dev → the austin-resume Worker. The Worker itself is created and
# updated by `wrangler deploy` (see .github/workflows/deploy.yml); Terraform only owns
# the hostname binding, so deploy at least once before applying this.
resource "cloudflare_workers_custom_domain" "resume" {
  account_id = var.cloudflare_account_id
  zone_id    = var.cloudflare_zone_id
  hostname   = var.hostname
  service    = var.worker_name
}

# austinhenry.dev → https://resume.austinhenry.dev (301). A Single Redirect runs at the
# edge before any origin is contacted, so the apex DNS records can stay as they are.
resource "cloudflare_ruleset" "apex_redirect" {
  zone_id = var.cloudflare_zone_id
  name    = "Apex redirect"
  kind    = "zone"
  phase   = "http_request_dynamic_redirect"

  rules = [{
    ref         = "apex_to_resume"
    description = "${var.apex_hostname} → https://${var.hostname}"
    expression  = "(http.host eq \"${var.apex_hostname}\")"
    action      = "redirect"
    enabled     = true
    action_parameters = {
      from_value = {
        status_code           = 301
        preserve_query_string = false
        target_url = {
          value = "https://${var.hostname}"
        }
      }
    }
  }]
}
