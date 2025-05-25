import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import {
  AppLayout, // Added AppLayout
  Card,
  Chip,
  Grid,
  GridItem,
  List,
  Table,
  Typography,
} from ".."; // Path adjusted
import type { DataWithId } from "../Table/types"; // Path adjusted

const meta: Meta = {
  title: "Sandbox/Application Examples/Dashboard App", // Title adjusted
  parameters: {
    docs: {
      autodocs: false,
    },
  },
};

export default meta;

type Story = StoryObj;

export const DashboardApp: Story = {
  render: () => {
    const [stats] = useState([
      {
        title: "総売上",
        value: "¥1,234,567",
        change: "+12.5%",
        color: "#4caf50",
      },
      { title: "新規顧客", value: "156", change: "+8.2%", color: "#2196f3" },
      { title: "注文数", value: "89", change: "-2.1%", color: "#ff9800" },
      { title: "在庫数", value: "1,234", change: "+5.7%", color: "#9c27b0" },
    ]);

    type Order = DataWithId & {
      orderId: string;
      customerName: string;
      amount: string;
      status: string;
      statusColor: string;
    };

    const sampleOrders: Order[] = [
      {
        id: "1",
        orderId: "#1234",
        customerName: "田中太郎",
        amount: "¥12,000",
        status: "配送中",
        statusColor: "#e3f2fd",
      },
      {
        id: "2",
        orderId: "#1235",
        customerName: "佐藤花子",
        amount: "¥8,500",
        status: "処理中",
        statusColor: "#fff3e0",
      },
      {
        id: "3",
        orderId: "#1236",
        customerName: "鈴木一郎",
        amount: "¥15,200",
        status: "完了",
        statusColor: "#e8f5e8",
      },
    ];

    const columnHelper = createColumnHelper<Order>();

    const orderColumns: ColumnDef<DataWithId, unknown>[] = [
      columnHelper.accessor("orderId", {
        header: "注文ID",
        cell: (info) => <Typography>{info.getValue()}</Typography>,
        id: "orderId",
      }),
      columnHelper.accessor("customerName", {
        header: "顧客名",
        cell: (info) => <Typography>{info.getValue()}</Typography>,
        id: "customerName",
      }),
      columnHelper.accessor("amount", {
        header: "金額",
        cell: (info) => <Typography>{info.getValue()}</Typography>,
        id: "amount",
        meta: {
          numeric: true,
        },
      }),
      columnHelper.accessor("status", {
        header: "ステータス",
        cell: (info) => (
          <Chip
            mode="outlined"
            compact
            style={{ backgroundColor: info.row.original.statusColor }}
          >
            {info.getValue()}
          </Chip>
        ),
        id: "status",
      }),
    ] as ColumnDef<DataWithId, unknown>[];

    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 3,
    });

    return (
      <AppLayout
        appbar={{
          title: "ダッシュボード",
          actions: [
            { icon: "refresh", onPress: () => {} },
            { icon: "dots-vertical", onPress: () => {} },
          ],
        }}
      >
        <ScrollView style={styles.content}>
          {/* Stats Cards */}
          <Grid variant="standard" spacing="comfortable">
            {stats.map((stat) => (
              <GridItem key={JSON.stringify(stat)} span={6}>
                <Card style={styles.statCard}>
                  <Card.Content>
                    <Typography variant="titleMedium">{stat.title}</Typography>
                    <Typography
                      variant="headlineSmall"
                      style={styles.statValue}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="bodySmall"
                      style={[styles.statChange, { color: stat.color }]}
                    >
                      {stat.change}
                    </Typography>
                  </Card.Content>
                </Card>
              </GridItem>
            ))}
          </Grid>

          {/* Chart and Side Info */}
          <Grid
            variant="standard"
            spacing="comfortable"
            style={{ marginTop: 16 }}
          >
            <GridItem span={8}>
              <Card style={styles.chartCard}>
                <Card.Title title="売上トレンド" />
                <Card.Content>
                  <View style={styles.chartPlaceholder}>
                    {/* Placeholder for chart library */}
                    <Typography variant="bodyMedium">
                      チャート表示エリア
                    </Typography>
                  </View>
                </Card.Content>
              </Card>
            </GridItem>
            <GridItem span={4}>
              <Card style={styles.sideCard}>
                <Card.Title title="クイックリンク" />
                <Card.Content>
                  <List.Item
                    title="新しい注文"
                    left={(props) => (
                      <List.Icon {...props} icon="plus-circle" />
                    )}
                    onPress={() => {}}
                  />
                  <List.Item
                    title="レポート生成"
                    left={(props) => <List.Icon {...props} icon="file-chart" />}
                    onPress={() => {}}
                  />
                  <List.Item
                    title="設定"
                    left={(props) => <List.Icon {...props} icon="cog" />}
                    onPress={() => {}}
                  />
                </Card.Content>
              </Card>
            </GridItem>
          </Grid>

          {/* Recent Orders Table */}
          <Grid
            variant="standard"
            spacing="comfortable"
            style={{ marginTop: 16 }}
          >
            <GridItem span={12}>
              <Card style={styles.tableCard}>
                <Card.Title title="最近の注文" />
                <Card.Content>
                  <Table
                    columns={orderColumns}
                    data={sampleOrders}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                  />
                </Card.Content>
              </Card>
            </GridItem>
          </Grid>
        </ScrollView>
      </AppLayout>
    );
  },
};

const styles = StyleSheet.create({
  // container style is no longer needed as AppLayout handles it
  content: {
    flex: 1,
    padding: 16,
  },
  statCard: {
    marginBottom: 16,
  },
  statValue: {
    marginTop: 4,
  },
  statChange: {
    marginTop: 2,
    fontSize: 12,
  },
  chartCard: {
    marginBottom: 16,
    height: 300,
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  sideCard: {
    marginBottom: 16,
  },
  tableCard: {
    marginBottom: 16,
  },
});
