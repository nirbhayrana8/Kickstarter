
import ListItem from "../../components/ListItem";
import { getAllCampaigns } from "../../config/database";

export const getServerSideProps = async () => {
  let data = await getAllCampaigns();
  if (data) {
    const keys = Object.keys(data);
    data = Object.values(data);
    data.forEach((campaign, index) => {
      campaign.campaignAddress = keys[index];
    });
  }
  return { props: { data } }
}

export default function AllCampaigns({ data }) {
  return (
    <>
      {data.map(campaignData => <ListItem data={campaignData} />)}
    </>
  )
}