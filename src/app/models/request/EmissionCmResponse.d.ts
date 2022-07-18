export interface EmissionCmResponse {
  omsId: string; // Unique OMS identifier. String
  orderId: string; // Unique OMS order ID String (UUID)
  expectedCompletionTime: number; // Expected order completion time in msec. Integer
}
