interface Face {
  enabled: boolean
  name: string
}

interface SimpleDisplay extends Face {
  display(): Promise<any>
}

interface SimpleDisplayWithDuration extends Face {
  display(duration?: number): Promise<any>
}
