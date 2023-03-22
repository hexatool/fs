
# Benchmarks

**System information:**
```
CPU: Apple M1 Pro 2.4GHz
Cores: 10 (10 Physical)
RAM: 32GB
Disk: Apple APPLE SSD AP0512R 466GB NVMe (PCIe)
OS: macOS macOS Ventura (darwin)
Kernel: 22.2.0 arm64
Node: v18.13.0
V8: 10.2.154.23-node.21
```

## Asynchronous
> 14680 files & 2110 directories

| name             | hz      | min     | max     | mean    | rme    | samples | 
|------------------|--------:|--------:|--------:|--------:|-------:|--------:| 
| @nodelib/fs.walk | 51.2966 | 13.9292 | 23.8682 | 19.4945 | ±3.67% | 26      | 
| fdir             | 51.4278 | 17.1554 | 22.7790 | 19.4447 | ±2.85% | 26      | 
| readdir-enhanced | 10.6886 | 89.5351 | 106.55  | 93.5578 | ±4.31% | 10      | 


## Stream
> 14680 files & 2110 directories

| name             | hz      | min     | max     | mean    | rme    | samples | 
|------------------|--------:|--------:|--------:|--------:|-------:|--------:| 
| @nodelib/fs.walk | 56.7435 | 14.4663 | 19.7264 | 17.6232 | ±3.26% | 29      | 
| klaw             | 3.0504  | 324.20  | 338.53  | 327.83  | ±1.54% | 10      | 
| readdir-enhanced | 9.9828  | 95.8640 | 107.68  | 100.17  | ±3.26% | 10      | 



## Synchronous
> 14680 files & 2110 directories

| name             | hz      | min     | max     | mean    | rme    | samples | 
|------------------|--------:|--------:|--------:|--------:|-------:|--------:| 
| @nodelib/fs.walk | 25.3280 | 35.6660 | 46.8352 | 39.4820 | ±5.32% | 13      | 
| fdir             | 28.4170 | 34.1660 | 36.5888 | 35.1903 | ±2.73% | 15      | 
| klaw-sync        | 9.0584  | 105.69  | 116.58  | 110.40  | ±2.90% | 10      | 
| readdir-enhanced | 6.2998  | 140.66  | 200.86  | 158.74  | ±6.89% | 10      | 

