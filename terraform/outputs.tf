output "resume_url" {
  description = "URL of the deployed resume"
  value       = "https://${var.hostname}"
}

output "custom_domain_id" {
  description = "ID of the Workers custom domain binding"
  value       = cloudflare_workers_custom_domain.resume.id
}

output "apex_redirect_ruleset_id" {
  description = "ID of the zone ruleset holding the apex redirect"
  value       = cloudflare_ruleset.apex_redirect.id
}
