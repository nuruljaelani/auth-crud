import Layout from "../components/Layout";

export async function getServerSideProps(context) {
  const token = context.req.cookies.token;

  return {
    props: { token }, // will be passed to the page component as props
  };
}

export default function Home({token}) {
  return (
    <>
      <Layout title="Dashboard" token={token}>
        <div className="flex flex-col px-6">
          <p className="font-bold text-xl md:text-2xl lg:text-3xl">Dashboard</p>
        </div>
      </Layout>
    </>
  );
}
