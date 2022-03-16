import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"

export default function dashboard() {
  return (
	<Tabs defaultActiveKey="created_campaigns" className="mb-3 nav-pills nav-fill">
		<Tab eventKey="created_campaigns" title="Created">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, commodi?
		</Tab>
		<Tab eventKey="invested_campaigns" title="Investments">
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, nam.
		</Tab>
	</Tabs>
  )
}
