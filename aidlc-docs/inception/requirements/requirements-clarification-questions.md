# Requirements Clarification Questions

Your answers to `requirement-verification-questions.md` are complete and consistent.

Because you **opted in to the Resiliency Baseline**, one mandatory follow-up is required before requirements can be finalized (RESILIENCY-02).

**Context for this project (already confirmed):** frontend-only Angular app, mock/in-memory state, no backend, no localStorage, no cross-refresh persistence. Many production DR concerns may be N/A — still pick the option that matches your intent.

Please fill in `[Answer]:` below, then reply in chat when done.

---

## Question 1
**RTO/RPO Goals and Disaster Recovery Strategy**
What are your Recovery Time Objective (RTO) and Recovery Point Objective (RPO) goals? These determine the appropriate Disaster Recovery strategy and infrastructure redundancy level.

A) RPO/RTO: Hours — Backup & Restore strategy. Lowest cost ($). Data backed up, no services deployed. Redeploy from IaC and restore from backups on failure. Suitable for non-critical workloads.

B) RPO/RTO: 10s of minutes — Pilot Light strategy. Cost: $$. Data live, services idle. Infrastructure deployed but not running, scaled up on failover. Suitable for important workloads.

C) RPO/RTO: Minutes — Warm Standby strategy. Cost: $$$. Data live, services run at reduced capacity. Scaled up during failover. Suitable for business-critical applications.

D) RPO/RTO: Near real-time — Multi-site Active/Active strategy. Highest cost ($$$$). Data live, live services in multiple regions simultaneously. Suitable for mission-critical, zero-downtime requirements.

E) N/A — Single-region / no DR needed for this phase. Frontend-only mock tool; no production persistence or multi-region requirement. Document as Low criticality prototype with in-memory state only.

X) Other (please describe after [Answer]: tag below)

[Answer]: E
