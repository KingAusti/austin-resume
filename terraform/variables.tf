variable "cloudflare_api_token" {
  description = "API token with Workers Scripts:Edit, Workers Routes:Edit and Zone Single Redirect:Edit (or Zone Rulesets:Edit) on the zone. Set via TF_VAR_cloudflare_api_token, never in a file."
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID (Dashboard → Workers & Pages → right sidebar)"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Zone ID for the domain (Dashboard → the zone → Overview → right sidebar)"
  type        = string
}

variable "hostname" {
  description = "Hostname served by the Worker, e.g. resume.austinhenry.dev"
  type        = string
}

variable "apex_hostname" {
  description = "Hostname that 301-redirects to `hostname`, e.g. austinhenry.dev"
  type        = string
}

variable "worker_name" {
  description = "Worker name — must match `name` in wrangler.jsonc"
  type        = string
  default     = "austin-resume"
}
