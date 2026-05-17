terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_workers_domain" "resume" {
  account_id = var.cloudflare_account_id
  hostname   = var.hostname
  service    = var.worker_name
  zone_id    = var.cloudflare_zone_id
}
