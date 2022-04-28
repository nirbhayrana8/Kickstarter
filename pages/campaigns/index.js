
import { getAllCampaigns } from "../../config/database";

export const getServerSideProps = async (context) => {
  let data = await getAllCampaigns();
  return { props: { data } }
}

export default function AllCampaigns({ data }) {
  console.log(data)
  return (
	<div>Here are all campaigns</div>
  )
}
