
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
> 15385 files & 2217 directories
| "name"             | "ops" | "margin" | "percentSlower" | 
|--------------------|-------|----------|-----------------| 
| "@nodelib/fs.walk" | 51    | 0.71     | 0               | 
| "fdir"             | 50    | 0.33     | 1.96            | 
| "readdir-enhanced" | 11    | 1.46     | 78.43           | 


## Stream
> 15385 files & 2217 directories
| "name"             | "ops" | "margin" | "percentSlower" | 
|--------------------|-------|----------|-----------------| 
| "@nodelib/fs.walk" | 51    | 1.15     | 0               | 
| "klaw"             | 3     | 1.98     | 94.12           | 
| "readdir-enhanced" | 11    | 1.2      | 78.43           | 



## Synchronous
> 15385 files & 2217 directories
| "name"             | "ops" | "margin" | "percentSlower" | 
|--------------------|-------|----------|-----------------| 
| "@nodelib/fs.walk" | 26    | 0.72     | 3.7             | 
| "fdir"             | 27    | 0.58     | 0               | 
| "klaw-sync"        | 9     | 1.04     | 66.67           | 
| "readdir-enhanced" | 6     | 6.52     | 77.78           | 

