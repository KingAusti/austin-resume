.PHONY: deploy preview tf-init tf-plan tf-apply setup

deploy:
	wrangler deploy

preview:
	wrangler dev

tf-init:
	cd terraform && terraform init

tf-plan:
	cd terraform && terraform plan -var-file=terraform.tfvars

tf-apply:
	cd terraform && terraform apply -var-file=terraform.tfvars

# First-time setup: provision custom domain, then deploy the worker
setup: tf-init tf-apply deploy
