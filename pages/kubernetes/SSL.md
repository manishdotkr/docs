# Use SSL with Ingress

## Add the Jetstack Helm repository
```sh
helm repo add jetstack https://charts.jetstack.io
helm repo update
```

## Install Cert-Manager CRDs
```sh kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.crds.yaml```

## Install Cert-Manager
```sh
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.3
```

## Verify Installation
```sh kubectl get pods -n cert-manager```

## Create secret with cloudflare api token
```sh
kubectl create secret generic cloudflare-token \
  -n cert-manager \
  --from-literal=token=YOUR_CLOUDFLARE_API_TOKEN
```

## Create ClusterIssuer
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-dns-cloudflare
  namespace: cert-manager
spec:
  acme:
    email: devops@manish.kr
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-account-key
    solvers:
    - dns01:
        cloudflare:
          apiTokenSecretRef:
            name: cloudflare-token
            key: token
```

## Create Ingress with TLS Configuration
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: your-app-ingress
  annotations:
    # Specify the DNS challenge issuer
    cert-manager.io/cluster-issuer: letsencrypt-dns-cloudflare
    # Optional: Traefik specific annotations
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
spec:
  ingressClassName: traefik
  tls:
  - hosts:
    - example.com
    - '*.example.com'  # Wildcard certificate
    secretName: example-tls-secret
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: your-service
            port:
              number: 80
```