+++
date = 2026-10-20T10:00:00-07:00
title = "k8s Lab Intro"
weight = 1
type = "docs"
description = '''
A brief overview of the k8s lab setup.
'''
+++

## Introduction

While I have been using a managed k8s cluster through work, it was being managed by a different team. I wanted to stand up my own k8s cluster to learn how all of these pieces fit together. I felt this was fundamentally important to my career. I should have a reasonable understanding of the platform I interact with all the time.

> [!NOTE] Software versions
>
> Development in this space is moving very rapidly. While trying to follow other guides only months old, I was hitting out-of-date information.
> That is part of the reason for this lab, to try and build something with the latest possible and bridge some of the gaps I've seen in online information.

## North Star

For any good lab, you need some kind of goal to build towards. That goal can keep changing with discovery, but without anything you're just looking at a blank sheet of paper. The goal helps focus the ideas and energy so you don't go off in a million directions all at once. If you do that, no work will ever get accomplished. For my North Star was to try and build out a full [Factorio](https://factorio.com/) Helm chart / server deployment.

## Lab setup

### Hardware

* **Dell R740xd:** This is running TrueNAS Scale and is acting as my NAS for home. For this lab, I am using an NFS shares on it with the k8s cluster. I purchased it used before the AI boom.
  * **Specs:**
    * **CPU:** 2 x Intel Xeon Platinum 8160 24-core @ 2.10 Ghz
    * **Memory:** 1 TB - 16 x 64 GB 2666 DDR4 ECC DIMMS
    * **Disk:** 12 x 3.6 GB U.2 NVMe
    * **Network:** Intel I350 GbE Controller 2 x 1 Gbps RJ45 - 2 x 10 Gbps SFP+
* **Dell R730xd:** This was the first server stood up as a Proxmox hypervisor.
  * **Specs:**
    * **CPU:** 2 x Intel Xeon CPU E5-2630 v3 8-core @ 2.40GHz
    * **Memory:** 64 GB - 4 x 16 GB 1866
    * **Disk:** 2 x 480 Gb SSD ( Rear OS drives ) - 48 TB zRAID2 8 x 6 TB 3.5" HDD
    * **Network:** Intel I350 GbE Controller 2 x 1 Gbps RJ45 - 2 x 10 Gbps SFP+
* **Dell R710:**
  * **Specs:**
    * **CPU:** 2 x Intel Xeon CPU X5650 24-core @ 2.67GHz
    * **Memory:** 72 GB ( Not sure on DIMM layout )
    * **Disk:** 1 x 240 Gb SATA SSD ( OS drive ) 48 TB zRAID2 6 x 6 TB 3.5" HDD
    * **Network:** Intel X520 Dual 10 Gbps SFP+
* **[Ubiquiti USW Aggregation Switch](https://techspecs.ui.com/unifi/switching/usw-aggregation?subcategory=all-switching):** 10 Gbps switch for all of the lab to talk to each other
* **[Ubiquiti UCG Max Gateway](https://techspecs.ui.com/unifi/cloud-gateways/ucg-max?s=us):** This has become very useful in this lab which you'll see later

### Network

* **Hypervisor/User:** 192.168.1.0/24
* **Nodes:** 192.168.100.0/24
  * Setup on VLAN 100, this is the entry point for all of my interaction with the k8s nodes.
* **Pods:** 10.244.0.0/16
* **Services:** 10.96.0.0/12
* **Load Balancers:** 172.16.0.0/16

Below is a high level network diagram of the layout. See [Full Description](#full-description) for the exhaustive explanation to what is going on here.

![High level network diagram](/images/k8sLab.drawio.svg)

### Software

* **Hypervisor:**
  * **[Proxmox](https://www.proxmox.com/en/):** I had used Proxmox in the past and found it really intuitive as a free to use Hypervisor. This was an easy choice.
    * A note about my implementation. I originally only started up one server, but was able to cobble together some parts and bring a second one up. This has me running them as two stand-alone hypervisors. From a lab perspective, I could have spun the VMs up on NFS or iSCSI, to allow for Live Migration, but I had a lot of disks. I figured might as well leverage that storage and save the network storage for the k8s PVCs.
* **OS:**
  * **[Talos Linux](https://www.siderolabs.com/talos-linux):**
    * **Version:** v1.14.2
    * **Description:** It's an immutable and minimal OS that is purpose built with k8s running right out of the box. I chose this because I wanted to get the OS out of the way. I've configured enough servers that I didn't want to burn time tracking down sysconfig settings and debugging SELinux alerts.
* **[Kubernetes](https://kubernetes.io/):**
  * **Client Version:** v1.37.1
  * **Kustomize Version:** v5.8.1
  * **Server Version:** v1.37.0
* **[k9s](https://k9scli.io/):**
  **Version:** v0.51.0
  **Description:** This is an incredible tool for interacting with k8s clusters. I would consider this a must install CLI tool. It allows you to visualize so much cluster information at once it.
* **[Helm](https://helm.sh/):**
  * **Client Version:** v4.3.1
  * **Description:** Helm is a package manager for k8s. It allows you to build up template workflows where you can apply a set of values to build out a deployment. You can also leverage exiting templates to install complete solution stacks.

  ![alt](/images/k9s.png)

## Full Description

With all of this hardware and software here is how it is all put together.

> [!NOTE]
> This section is a work in progress. I plan on linking different sections to their own specific guides as I complete them.

### Internet

Internet is nothing special. Just consumer cable broadband, with a random IP that's fairly static unless there is some maintenance that kicks my modem off the provider.

### Router

The router is a [Ubiquity UCG-Max](https://techspecs.ui.com/unifi/cloud-gateways/ucg-max?s=us). While the k8s lab was not a consideration when I purchased this, it has proven to be very helpful in extending the lab. Some features that I have been able to leverage with different deployments:

* **BGP Advertisements:** Using [Cilium](https://docs.cilium.io/en/stable/) I am able to create Load Balancer IPs that are advertized to the router. This allows me to directly connect to the `172.16.0.0/16` subnet through the advertized routes. It is even possible to port-forward from the router to these advertised routes.
* **[External DNS Unifi Webhook](https://github.com/home-operations/external-dns-unifi-webhook):** This is a webhook provider for the [`External DNS`](https://github.com/kubernetes-sigs/external-dns) CRD. You create an API Key on your router and then add it to a webhook config. Then when you supply the annotations like:

   ```yaml {style=native}
    service:
      annotations:
        lbipam.cilium.io/ips: 172.16.0.101
        external-dns.kubernetes.io/hostname: factorio-test-01.home.arpa
   ```

  This will automatically trigger a webhook to create a DNS A record for the above hostname and IP. If you delete it, the record is cleaned up automatically.
* **Automatic port-forwarding:** TODO Right now there are two separate projects that look like they can do the same thing. I have just hit the point where I can start to investigate these. The idea is that through service annotations, they will trigger webhooks to the Unifi Router to create a port-forward policy for the service you create. I will update this section when I've settled on a solution.
  * **[unifi-port-forward](https://github.com/fiskhest/unifi-port-forward)**
  * **[port-forwarding-controller](https://github.com/ljfranklin/port-forwarding-controller)** *Last commit was 8 years ago. Probably not going to use this one*

> [!TIP]
> Just like in the above situation, you can often find multiple projects with overlapping functionality. It is important to look at how active these repositories are. One that's 8 years old without any activity is likely not going to have a broad adoption. This translates into fewer resources that will have used it and documented problems / solutions on sites like [Stackoverflow](https://stackoverflow.com/questions). This is something I always consider, especially if I'm going to find myself as the sole solution provider for the technology of choice.
