// DB row → frontend format helpers

export function toRouter(r) {
  return {
    id: r.id,
    name: r.name,
    location: r.location,
    ip: r.ip,
    status: r.status,
    cpu: Number(r.cpu) || 0,
    memory: Number(r.memory) || 0,
    uptime: r.uptime,
    trafficIn: parseFloat(r.traffic_in) || 0,
    trafficOut: parseFloat(r.traffic_out) || 0,
    lastSeen: r.last_seen,
  };
}

export function toClient(c) {
  return {
    id: c.id,
    name: c.name,
    plan: c.plan,
    ip: c.ip,
    router: c.router_name,
    status: c.status,
    bandwidth: parseFloat(c.bandwidth) || 0,
    ping: Number(c.ping) || 0,
    contractEnd: c.contract_end,
  };
}

export function toInstallation(i) {
  return {
    id: i.id,
    clientName: i.client_name,
    address: i.address,
    plan: i.plan,
    technician: i.technician,
    status: i.status,
    scheduledDate: i.scheduled_date,
    completedDate: i.completed_date,
    notes: i.notes,
  };
}

export function toMaintenance(m) {
  return {
    id: m.id,
    routerName: m.router_name,
    type: m.type,
    description: m.description,
    technician: m.technician,
    status: m.status,
    startDate: m.start_date,
    endDate: m.end_date,
    duration: m.duration,
  };
}

export function toInvoice(inv) {
  return {
    id: inv.id,
    client: inv.client_name,
    plan: inv.plan,
    amount: Number(inv.amount) || 0,
    status: inv.status,
    issueDate: inv.issue_date,
    dueDate: inv.due_date,
    paidDate: inv.paid_date,
    period: inv.period,
  };
}

export function toAlert(a) {
  return {
    id: a.id,
    type: a.type,
    message: a.message,
    router: a.router_name,
    timestamp: a.timestamp,
    acknowledged: a.acknowledged,
  };
}

export function toSiteSummary(s) {
  return {
    site: s.site,
    psb: Number(s.psb_cumulative) || 0,
    mt: Number(s.mt_cumulative) || 0,
    psbCurrentMonth: Number(s.psb_current_month) || 0,
    mtCurrentMonth: Number(s.mt_current_month) || 0,
  };
}

export function toMonthly(m) {
  return {
    bulan: m.bulan,
    knc: Number(m.knc) || 0,
    rpm: Number(m.rpm) || 0,
    ptk: Number(m.ptk) || 0,
    total: Number(m.total) || 0,
  };
}
