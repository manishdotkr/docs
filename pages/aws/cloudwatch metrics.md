# Collect Process Metrics with the `procstat` Plugin

The `procstat` plugin enables you to collect metrics from individual processes. The plugin is supported on **Linux servers** and **Windows Server**. This document explains how to configure the CloudWatch agent for `procstat`, view imported metrics, and lists the metrics that `procstat` collects.

> **Note**
> The `procstat` plugin is not supported for the **Fargate launch type** in Amazon ECS environments.

---

## Topics

* [Configure the CloudWatch Agent for procstat](#configure-the-cloudwatch-agent-for-procstat)
* [Metrics Collected by procstat](#metrics-collected-by-procstat)

---

## Configure the CloudWatch Agent for procstat

To use the `procstat` plugin, add a `procstat` section under the `metrics_collected` section in the CloudWatch agent configuration file. You can specify processes to monitor using one of the following methods (only one method is used even if multiple are specified):

* **`pid_file`**: Selects processes by PID file name.
* **`exe`**: Selects processes with names matching a specified string (regex).
* **`pattern`**: Selects processes by the full command-line string (regex).

> If multiple sections are specified, `CloudWatch agent` uses:
>
> * `pid_file` (if present)
> * Otherwise, `exe`
> * Otherwise, `pattern`

* On **Linux**, `exe` and `pattern` are evaluated as regular expressions.
* On **Windows Server**, they are evaluated as WMI queries (e.g., `pattern: "%apache%"`).

You can optionally include `metrics_collection_interval` (in seconds). Default is `60`.

---

### Configure with `pid_file`

```json
{
  "metrics": {
    "metrics_collected": {
      "procstat": [
        {
          "pid_file": "/var/run/example1.pid",
          "measurement": ["cpu_usage", "memory_rss"]
        },
        {
          "pid_file": "/var/run/example2.pid",
          "measurement": ["read_bytes", "read_count", "write_bytes"],
          "metrics_collection_interval": 10
        }
      ]
    }
  }
}
```

---

### Configure with `exe`

```json
{
  "metrics": {
    "metrics_collected": {
      "procstat": [
        {
          "exe": "agent",
          "measurement": ["cpu_time", "cpu_time_system", "cpu_time_user"]
        },
        {
          "exe": "plugin",
          "measurement": ["cpu_time", "cpu_time_system", "cpu_time_user"]
        }
      ]
    }
  }
}
```

---

### Configure with `pattern`

```json
{
  "metrics": {
    "metrics_collected": {
      "procstat": [
        {
          "pattern": "config",
          "measurement": [
            "rlimit_memory_data_hard",
            "rlimit_memory_data_soft",
            "rlimit_memory_stack_hard",
            "rlimit_memory_stack_soft"
          ]
        },
        {
          "pattern": "-c",
          "measurement": [
            "rlimit_memory_data_hard",
            "rlimit_memory_data_soft",
            "rlimit_memory_stack_hard",
            "rlimit_memory_stack_soft"
          ]
        }
      ]
    }
  }
}
```

---

## Metrics Collected by `procstat`

The following table lists metrics collected by the `procstat` plugin. For Linux, metric names are prefixed with `procstat_`. For Windows Server, a space is used (e.g., `procstat cpu_time`).

| **Metric Name**                  | **Available On**             | **Description**                                    | **Unit** |
| -------------------------------- | ---------------------------- | -------------------------------------------------- | -------- |
| cpu\_time                        | Linux                        | CPU time used by process                           | Count    |
| cpu\_time\_guest                 | Linux                        | Time in guest mode                                 | None     |
| cpu\_time\_guest\_nice           | Linux                        | Time in nice guest                                 | None     |
| cpu\_time\_idle                  | Linux                        | Time in idle mode                                  | None     |
| cpu\_time\_iowait                | Linux                        | Time waiting for I/O                               | None     |
| cpu\_time\_irq                   | Linux                        | Time servicing interrupts                          | None     |
| cpu\_time\_nice                  | Linux                        | Time in nice mode                                  | None     |
| cpu\_time\_soft\_irq             | Linux                        | Time servicing software interrupts                 | None     |
| cpu\_time\_steal                 | Linux                        | Time spent running other OS in virtualization      | None     |
| cpu\_time\_stolen                | Linux, Windows Server        | Time in stolen mode                                | None     |
| cpu\_time\_system                | Linux, Windows Server, macOS | Time in system mode                                | Count    |
| cpu\_time\_user                  | Linux, Windows Server, macOS | Time in user mode                                  | Count    |
| cpu\_usage                       | Linux, Windows Server, macOS | CPU utilization percentage                         | Percent  |
| memory\_data                     | Linux, macOS                 | Memory used for data                               | Bytes    |
| memory\_locked                   | Linux, macOS                 | Locked memory                                      | Bytes    |
| memory\_rss                      | Linux, Windows Server, macOS | Resident set memory usage                          | Bytes    |
| memory\_stack                    | Linux, macOS                 | Stack memory usage                                 | Bytes    |
| memory\_swap                     | Linux, macOS                 | Swap memory usage                                  | Bytes    |
| memory\_vms                      | Linux, Windows Server, macOS | Virtual memory size                                | Bytes    |
| num\_fds                         | Linux                        | Number of file descriptors open                    | None     |
| num\_threads                     | Linux, Windows, macOS        | Number of threads                                  | None     |
| pid                              | Linux, Windows Server, macOS | Process ID                                         | None     |
| pid\_count                       | Linux, Windows Server, macOS | Number of PIDs (e.g., `procstat_lookup_pid_count`) | None     |
| read\_bytes                      | Linux, Windows Server        | Disk bytes read by the process                     | Bytes    |
| write\_bytes                     | Linux, Windows Server        | Disk bytes written by the process                  | Bytes    |
| read\_count                      | Linux, Windows Server        | Number of disk read operations                     | None     |
| rlimit\_realtime\_priority\_hard | Linux                        | Hard limit for real-time priority                  | None     |
| rlimit\_realtime\_priority\_soft | Linux                        | Soft limit for real-time priority                  | None     |
| rlimit\_signals\_pending\_hard   | Linux                        | Hard limit for pending signals                     | None     |
| rlimit\_signals\_pending\_soft   | Linux                        | Soft limit for pending signals                     | None     |
| rlimit\_nice\_priority\_hard     | Linux                        | Hard limit for nice priority                       | None     |
| rlimit\_nice\_priority\_soft     | Linux                        | Soft limit for nice priority                       | None     |

---

## Ref: [AWS DOCS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)