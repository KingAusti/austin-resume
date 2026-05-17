variable "cloudflare_api_token" {
  description = "Cloudflare API token with Workers:Edit and Zone:Edit permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID (Dashboard → right sidebar)"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Zone ID for the domain (Dashboard → your domain → right sidebar)"
  type        = string
}

variable "hostname" {
  description = "Custom hostname to point at the Worker, e.g. resume.yourdomain.com"
  type        = string
}

variable "worker_name" {
  description = "Worker service name — must match `name` in wrangler.toml"
  type        = string
  default     = "austin-resume"
}
