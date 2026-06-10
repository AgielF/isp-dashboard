// Mock data - struktur ini mencerminkan response API nyata
export const routers = [
  {
    id: 1,
    name: "R-BDG-01",
    location: "Bandung",
    ip: "192.168.1.1",
    status: "online",
    cpu: 25,
    memory: 45,
    uptime: "15d 3h 22m",
    trafficIn: 1.2,
    trafficOut: 0.8,
    lastSeen: "2026-06-10T10:30:00Z"
  },
  {
    id: 2,
    name: "R-CMH-01",
    location: "Cimahi",
    ip: "192.168.2.1",
    status: "online",
    cpu: 32,
    memory: 52,
    uptime: "8d 12h 45m",
    trafficIn: 0.85,
    trafficOut: 0.62,
    lastSeen: "2026-06-10T10:30:00Z"
  },
  {
    id: 3,
    name: "R-JTN-01",
    location: "Jakarta",
    ip: "192.168.3.1",
    status: "offline",
    cpu: 0,
    memory: 0,
    uptime: "0d 0h 0m",
    trafficIn: 0,
    trafficOut: 0,
    lastSeen: "2026-06-10T08:15:00Z"
  },
  {
    id: 4,
    name: "R-SBY-01",
    location: "Surabaya",
    ip: "192.168.4.1",
    status: "online",
    cpu: 18,
    memory: 38,
    uptime: "22d 5h 10m",
    trafficIn: 2.1,
    trafficOut: 1.5,
    lastSeen: "2026-06-10T10:30:00Z"
  },
  {
    id: 5,
    name: "R-YGY-01",
    location: "Yogyakarta",
    ip: "192.168.5.1",
    status: "online",
    cpu: 42,
    memory: 61,
    uptime: "5d 18h 33m",
    trafficIn: 0.95,
    trafficOut: 0.71,
    lastSeen: "2026-06-10T10:30:00Z"
  }
]

export const getRouterStats = () => {
  const online = routers.filter(r => r.status === "online").length
  const offline = routers.length - online
  const totalTraffic = routers.reduce((sum, r) => sum + r.trafficIn + r.trafficOut, 0)
  
  return {
    total: routers.length,
    online,
    offline,
    totalTraffic: totalTraffic.toFixed(2) + " Gbps"
  }
}