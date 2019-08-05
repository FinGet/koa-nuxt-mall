export default function ({ store, redirect }) {
  
  if (!store.state.user.userName) {
    return redirect('/login')
  }
}