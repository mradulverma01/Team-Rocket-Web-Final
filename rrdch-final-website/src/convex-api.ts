const query = (name: string) => name as any
const mutation = (name: string) => name as any

export type ViewerProfile = {
  _id: string
  name?: string
  email?: string
  phone?: string
  image?: string
  role?: 'patient' | 'student' | 'doctor' | 'admin'
}

export const convexApi = {
  users: {
    viewerProfile: query('users:viewerProfile'),
    upsertViewerProfile: mutation('users:upsertViewerProfile')
  },
  appointments: {
    createBooking: mutation('appointments:createBooking'),
    listForViewer: query('appointments:listForViewer')
  }
}
