# Monitoring Kubernetes Node & Pod Resource Usage with Metrics Server

This guide explains how to deploy the **Kubernetes Metrics Server** in an Amazon EKS cluster and use it to monitor **CPU** and **memory usage** for nodes and pods.

---

## 📌 Overview

The **metrics-server** collects resource metrics from each node’s kubelet and exposes them through the **Kubernetes Metrics API**.  
These metrics can then be viewed using commands like:

```bash
kubectl top nodes
kubectl top pods
````

---

## 1️⃣ Prerequisites

* A running **EKS** cluster
* `kubectl` installed and configured
* Permissions to create resources in the `kube-system` namespace

Check your current context:

```bash
kubectl config current-context
```

---

## 2️⃣ Deploy Metrics Server

Apply the official metrics-server manifest:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

This will create:

* `metrics-server` deployment in `kube-system` namespace
* Required ClusterRoles, RoleBindings, and APIService

---

## 3️⃣ EKS Compatibility Fix

On EKS, kubelet uses **self-signed certificates**, which can cause TLS errors in metrics-server.
To fix this, add `--kubelet-insecure-tls` to the metrics-server container args.

Edit the deployment:

```bash
kubectl -n kube-system edit deployment metrics-server
```

Find the container `args` section and update it:

```yaml
spec:
  template:
    spec:
      containers:
      - name: metrics-server
        args:
        - --cert-dir=/tmp
        - --secure-port=4443
        - --kubelet-preferred-address-types=InternalIP,Hostname,InternalDNS,ExternalDNS,ExternalIP
        - --kubelet-insecure-tls
```

Save and exit.
The deployment will restart automatically.

---

## 4️⃣ Verify Metrics Server

Check if the deployment is running:

```bash
kubectl get deployment metrics-server -n kube-system
```

Expected output:

```
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
metrics-server   1/1     1            1           1m
```

---

## 5️⃣ Viewing Node & Pod Usage

Once running, you can check **node usage**:

```bash
kubectl top nodes
```

Example output:

```
NAME                                          CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
ip-10-0-1-45.ap-south-2.compute.internal      450m         22%    1200Mi          60%
ip-10-0-2-30.ap-south-2.compute.internal      300m         15%    900Mi           45%
```

Check **pod usage** (all namespaces):

```bash
kubectl top pods -A
```

Example output:

```
NAMESPACE     NAME                          CPU(cores)   MEMORY(bytes)
default       nginx-5d59d67564-b8k2h         2m           6Mi
kube-system   coredns-66bff467f8-bn2fk       3m           12Mi
```

---

## 6️⃣ Filtering by Node Group or Labels

If your nodes are labeled (e.g., `workload=emqx`), you can filter:

```bash
kubectl top nodes -l workload=emqx
```

To view usage for only pods with a label:

```bash
kubectl top pods -A -l app=nginx
```

---

## 7️⃣ Common Issues

### ❌ `error: Metrics API not available`

* The metrics-server is not installed or not running.
* Fix: Check with:

  ```bash
  kubectl get deployment metrics-server -n kube-system
  ```

### ❌ `x509: certificate signed by unknown authority`

* Fix: Add `--kubelet-insecure-tls` in the deployment args.

---

## 8️⃣ Useful Commands Summary

| Command                                                 | Description                                     |
| ------------------------------------------------------- | ----------------------------------------------- |
| `kubectl apply -f <url>`                                | Deploy metrics-server                           |
| `kubectl -n kube-system edit deployment metrics-server` | Add insecure TLS flag                           |
| `kubectl top nodes`                                     | Show CPU/Memory usage for nodes                 |
| `kubectl top pods -A`                                   | Show CPU/Memory usage for pods (all namespaces) |
| `kubectl top nodes -l key=value`                        | Show usage for labeled nodes                    |
| `kubectl top pods -n namespace`                         | Show usage for pods in a namespace              |

---

## 9️⃣ Version Compatibility

| Metrics Server Version | Kubernetes Version |
| ---------------------- | ------------------ |
| v0.7.x                 | 1.19 – 1.27+       |
| v0.6.x                 | 1.17 – 1.25        |
| v0.5.x                 | 1.14 – 1.21        |

For EKS with Kubernetes **1.33.x**, use the **latest v0.7.x** release.

---

## 🔗 References

* [Metrics Server GitHub](https://github.com/kubernetes-sigs/metrics-server)
* [EKS Monitoring Docs](https://docs.aws.amazon.com/eks/latest/userguide/metrics-server.html)

---
