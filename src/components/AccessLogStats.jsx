import { Card, Row, Col, Statistic } from "antd";
import {
	SearchOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from "@ant-design/icons";

function AccessLogStats({ stats }) {
	return (
		<Row gutter={16} className="mt-4">
			<Col span={8}>
				<Card>
					<Statistic
						title="Total Access Attempts"
						value={stats.total}
						prefix={<SearchOutlined />}
					/>
				</Card>
			</Col>
			<Col span={8}>
				<Card>
					<Statistic
						title="Granted Access"
						value={stats.granted}
						valueStyle={{ color: "#3f8600" }}
						prefix={<CheckCircleOutlined />}
					/>
				</Card>
			</Col>
			<Col span={8}>
				<Card>
					<Statistic
						title="Denied Access"
						value={stats.denied}
						valueStyle={{ color: "#cf1322" }}
						prefix={<CloseCircleOutlined />}
					/>
				</Card>
			</Col>
		</Row>
	);
}

export default AccessLogStats;
