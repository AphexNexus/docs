+++
date = 2026-10-20T10:00:00-07:00
title = "BGP Routing"
weight = 5
type = "docs"
draft = "true"
description = '''
How to setup BGP Routing with Cilium and a Unifi Gateway.
'''
+++

* Using BGP:
  * Routes to be advertised:

    ```sh {style=native}
    VRouter   Peer            Prefix            NextHop           Age        Attrs
    65000     192.168.100.1   172.16.0.10/32    192.168.100.139   26h58m3s   [{Origin: i} {AsPath: 65000} {Nexthop: 192.168.100.139}]
    65000     192.168.100.1   172.16.0.100/32   192.168.100.139   26h58m3s   [{Origin: i} {AsPath: 65000} {Nexthop: 192.168.100.139}]
    65000     192.168.100.1   172.16.0.101/32   192.168.100.139   26h13m6s   [{Origin: i} {AsPath: 65000} {Nexthop: 192.168.100.139}]
    ```

  * Route advertisements that the route will see:

    ```sh {style=native}
    Node             VRouter   Prefix            NextHop   Age         Attrs
    talos-cp-1       65000     172.16.0.100/32   0.0.0.0   26h57m51s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.101/32   0.0.0.0   26h13m46s   [{Origin: i} {Nexthop: 0.0.0.0}]
    talos-cp-2       65000     172.16.0.100/32   0.0.0.0   26h59m4s    [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.101/32   0.0.0.0   26h13m46s   [{Origin: i} {Nexthop: 0.0.0.0}]
    talos-cp-3       65000     172.16.0.100/32   0.0.0.0   26h57m59s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.101/32   0.0.0.0   26h13m46s   [{Origin: i} {Nexthop: 0.0.0.0}]
    talos-worker-1   65000     172.16.0.10/32    0.0.0.0   26h59m11s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.100/32   0.0.0.0   26h59m11s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.101/32   0.0.0.0   26h13m46s   [{Origin: i} {Nexthop: 0.0.0.0}]
    talos-worker-2   65000     172.16.0.10/32    0.0.0.0   26h57m32s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.100/32   0.0.0.0   26h57m32s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.101/32   0.0.0.0   26h13m46s   [{Origin: i} {Nexthop: 0.0.0.0}]
    talos-worker-3   65000     172.16.0.10/32    0.0.0.0   26h58m18s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.100/32   0.0.0.0   26h58m18s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.101/32   0.0.0.0   26h13m46s   [{Origin: i} {Nexthop: 0.0.0.0}]
    talos-worker-4   65000     172.16.0.10/32    0.0.0.0   26h57m32s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.100/32   0.0.0.0   26h57m32s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.101/32   0.0.0.0   26h13m46s   [{Origin: i} {Nexthop: 0.0.0.0}]
    talos-worker-5   65000     172.16.0.10/32    0.0.0.0   26h58m32s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.100/32   0.0.0.0   26h58m32s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.101/32   0.0.0.0   26h13m46s   [{Origin: i} {Nexthop: 0.0.0.0}]
    talos-worker-6   65000     172.16.0.10/32    0.0.0.0   26h58m54s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.100/32   0.0.0.0   26h58m54s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.101/32   0.0.0.0   26h38m21s   [{Origin: i} {Nexthop: 0.0.0.0}]
    talos-worker-7   65000     172.16.0.10/32    0.0.0.0   26h58m43s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.100/32   0.0.0.0   26h58m43s   [{Origin: i} {Nexthop: 0.0.0.0}]
                     65000     172.16.0.101/32   0.0.0.0   26h13m46s   [{Origin: i} {Nexthop: 0.0.0.0}]
    ```
