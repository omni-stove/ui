import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AppLayout, // Added AppLayout
  Button,
  Card,
  Chip,
  Grid,
  GridItem,
  IconButton,
  Searchbar,
  Snackbar,
  Typography,
} from ".."; // Path adjusted

const meta: Meta = {
  title: "Sandbox/Shopping App", // Title adjusted
  parameters: {
    docs: {
      autodocs: false,
    },
  },
};

export default meta;

type Story = StoryObj;

export const ShoppingApp: Story = {
  render: () => {
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const addToCart = () => {
      setCartCount(cartCount + 1);
      setSnackbarVisible(true);
    };

    return (
      <AppLayout
        appbar={{
          title: "ショップ",
          actions: [{ icon: "cart", onPress: () => {} }],
        }}
      >
        <ScrollView style={styles.content}>
          <Searchbar
            placeholder="商品を検索..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />

          {/* カテゴリーチップ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            <View style={styles.categoryChip}>
              <Chip variant="filter" isSelected>
                すべて
              </Chip>
            </View>
            <View style={styles.categoryChip}>
              <Chip variant="filter">ファッション</Chip>
            </View>
            <View style={styles.categoryChip}>
              <Chip variant="filter">エレクトロニクス</Chip>
            </View>
            <View style={styles.categoryChip}>
              <Chip variant="filter">ホーム</Chip>
            </View>
            <View style={styles.categoryChip}>
              <Chip variant="filter">スポーツ</Chip>
            </View>
          </ScrollView>

          {/* 商品リスト - Grid Layout使用 */}
          <Grid variant="standard" spacing="comfortable">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <GridItem key={item} span={6}>
                <Card>
                  <Card.Cover
                    source={{
                      uri: `https://picsum.photos/200/150?random=${item}`,
                    }}
                  />
                  <Card.Content style={styles.productContent}>
                    <Typography variant="titleMedium">商品 {item}</Typography>
                    <View style={styles.productDescription}>
                      <Typography variant="bodySmall">
                        高品質な商品の説明文がここに入ります
                      </Typography>
                    </View>
                    <View style={styles.price}>
                      <Typography variant="titleLarge">
                        ¥{(item * 1000).toLocaleString()}
                      </Typography>
                    </View>
                  </Card.Content>
                  <Card.Actions>
                    <Button onPress={addToCart}>カートに追加</Button>
                    <IconButton icon="heart-outline" onPress={() => {}} />
                  </Card.Actions>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </ScrollView>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          action={{
            label: "カートを見る",
            onPress: () => {},
          }}
        >
          商品をカートに追加しました
        </Snackbar>
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
  searchbar: {
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  productContent: {
    paddingTop: 8,
  },
  productDescription: {
    marginTop: 4,
    marginBottom: 8,
    minHeight: 30,
  },
  price: {
    marginTop: "auto",
    fontWeight: "bold",
  },
});
