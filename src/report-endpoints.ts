// Reporting API
// see: https://w3c.github.io/reporting/

export class ReportEndpoints {
  readonly endpoints: Map<string, string> = new Map()

  add(group: string, uri: string) {
    this.endpoints.set(group, uri)
  }

  toString() {
  }
}
