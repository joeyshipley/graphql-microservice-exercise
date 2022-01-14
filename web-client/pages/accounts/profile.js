export default function ProfilePage({ data }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>
        <label>Username: </label> <span>{ data.username }</span>
      </div>
      <div>
        <label>Email: </label> <span>{ data.email }</span>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  // TODO: implement unauthorized response
  // TODO: implement profile fetching w/bearer token

  // Fetch data from external API
  // const res = await fetch(`https://.../data`)
  // const data = await res.json()
  const data = { email: 'not hooked up yet', username: 'not hooked up yet' };

  // Pass data to the page via props
  return { props: { data } }
}