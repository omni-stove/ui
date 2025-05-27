import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AppLayout,
  Button,
  Card,
  Checkbox,
  CheckboxList,
  DatePicker,
  Divider,
  Grid,
  GridItem,
  RadioButton,
  Select,
  Slider,
  Snackbar,
  Switch,
  TextField,
  TimePicker,
  Typography,
} from "..";

const meta: Meta = {
  title: "Sandbox/Complex Form App",
  parameters: {
    docs: {
      autodocs: false,
    },
  },
};

export default meta;

type Story = StoryObj;

type FormData = {
  // 基本情報
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // 住所情報
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;

  // 個人情報
  gender: string;
  birthDate: Date | null;
  occupation: string;

  // 設定・選択項目
  hobbies: string[];
  preferredTime: Date | null;
  budget: number;
  newsletter: boolean;
  notifications: boolean;

  // 同意項目
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

export const ComplexFormApp: Story = {
  render: () => {
    const [formData, setFormData] = useState<FormData>({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postalCode: "",
      prefecture: "",
      city: "",
      address: "",
      gender: "",
      birthDate: null,
      occupation: "",
      hobbies: [],
      preferredTime: null,
      budget: 50000,
      newsletter: false,
      notifications: true,
      termsAccepted: false,
      privacyAccepted: false,
      marketingAccepted: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const prefectures = [
      { label: "北海道", value: "hokkaido" },
      { label: "青森県", value: "aomori" },
      { label: "岩手県", value: "iwate" },
      { label: "宮城県", value: "miyagi" },
      { label: "秋田県", value: "akita" },
      { label: "山形県", value: "yamagata" },
      { label: "福島県", value: "fukushima" },
      { label: "茨城県", value: "ibaraki" },
      { label: "栃木県", value: "tochigi" },
      { label: "群馬県", value: "gunma" },
      { label: "埼玉県", value: "saitama" },
      { label: "千葉県", value: "chiba" },
      { label: "東京都", value: "tokyo" },
      { label: "神奈川県", value: "kanagawa" },
    ];

    const occupations = [
      { label: "会社員", value: "employee" },
      { label: "公務員", value: "public_servant" },
      { label: "自営業", value: "self_employed" },
      { label: "学生", value: "student" },
      { label: "主婦・主夫", value: "homemaker" },
      { label: "フリーランス", value: "freelancer" },
      { label: "その他", value: "other" },
    ];

    const hobbiesItems = [
      { id: "reading", label: "読書" },
      { id: "movies", label: "映画鑑賞" },
      { id: "music", label: "音楽" },
      { id: "sports", label: "スポーツ" },
      { id: "cooking", label: "料理" },
      { id: "travel", label: "旅行" },
      { id: "gaming", label: "ゲーム" },
      { id: "photography", label: "写真" },
    ];

    const updateFormData = <K extends keyof FormData>(
      key: K,
      value: FormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      // エラーをクリア
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    };

    const validateForm = (): boolean => {
      const newErrors: FormErrors = {};

      // 必須項目チェック
      if (!formData.firstName.trim()) {
        newErrors.firstName = "名前（姓）は必須です";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "名前（名）は必須です";
      }
      if (!formData.email.trim()) {
        newErrors.email = "メールアドレスは必須です";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "有効なメールアドレスを入力してください";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "電話番号は必須です";
      } else if (!/^[\d-]+$/.test(formData.phone)) {
        newErrors.phone = "有効な電話番号を入力してください";
      }
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = "郵便番号は必須です";
      } else if (!/^\d{3}-?\d{4}$/.test(formData.postalCode)) {
        newErrors.postalCode =
          "有効な郵便番号を入力してください（例：123-4567）";
      }
      if (!formData.prefecture) {
        newErrors.prefecture = "都道府県を選択してください";
      }
      if (!formData.city.trim()) {
        newErrors.city = "市区町村は必須です";
      }
      if (!formData.address.trim()) {
        newErrors.address = "番地・建物名は必須です";
      }
      if (!formData.gender) {
        newErrors.gender = "性別を選択してください";
      }
      if (!formData.birthDate) {
        newErrors.birthDate = "生年月日を選択してください";
      }
      if (!formData.occupation) {
        newErrors.occupation = "職業を選択してください";
      }
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = "利用規約への同意は必須です";
      }
      if (!formData.privacyAccepted) {
        newErrors.privacyAccepted = "プライバシーポリシーへの同意は必須です";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        setSnackbarMessage("入力内容に不備があります");
        setSnackbarVisible(true);
        return;
      }

      setIsSubmitting(true);

      // 送信処理のシミュレーション
      setTimeout(() => {
        setIsSubmitting(false);
        setSnackbarMessage("フォームが正常に送信されました！");
        setSnackbarVisible(true);

        // フォームリセット
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          postalCode: "",
          prefecture: "",
          city: "",
          address: "",
          gender: "",
          birthDate: null,
          occupation: "",
          hobbies: [],
          preferredTime: null,
          budget: 50000,
          newsletter: false,
          notifications: true,
          termsAccepted: false,
          privacyAccepted: false,
          marketingAccepted: false,
        });
      }, 2000);
    };

    return (
      <AppLayout
        appbar={{
          title: "会員登録フォーム",
          backAction: { onPress: () => {} },
        }}
      >
        <ScrollView style={styles.content}>
          {/* 基本情報セクション */}
          <Card style={styles.section}>
            <Card.Title title="基本情報" />
            <Card.Content>
              <Grid variant="standard" spacing="comfortable">
                <GridItem span={6}>
                  <TextField
                    label="姓"
                    value={formData.firstName}
                    onChangeText={(text) => updateFormData("firstName", text)}
                    errorMessage={errors.firstName}
                    required
                  />
                </GridItem>
                <GridItem span={6}>
                  <TextField
                    label="名"
                    value={formData.lastName}
                    onChangeText={(text) => updateFormData("lastName", text)}
                    errorMessage={errors.lastName}
                    required
                  />
                </GridItem>
                <GridItem span={12}>
                  <TextField
                    label="メールアドレス"
                    value={formData.email}
                    onChangeText={(text) => updateFormData("email", text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    errorMessage={errors.email}
                    required
                  />
                </GridItem>
                <GridItem span={12}>
                  <TextField
                    label="電話番号"
                    value={formData.phone}
                    onChangeText={(text) => updateFormData("phone", text)}
                    keyboardType="phone-pad"
                    errorMessage={errors.phone}
                    required
                  />
                </GridItem>
              </Grid>
            </Card.Content>
          </Card>

          {/* 住所情報セクション */}
          <Card style={styles.section}>
            <Card.Title title="住所情報" />
            <Card.Content>
              <Grid variant="standard" spacing="comfortable">
                <GridItem span={4}>
                  <TextField
                    label="郵便番号"
                    value={formData.postalCode}
                    onChangeText={(text) => updateFormData("postalCode", text)}
                    supportingText="例：123-4567"
                    errorMessage={errors.postalCode}
                    required
                  />
                </GridItem>
                <GridItem span={8}>
                  <Select
                    label="都道府県"
                    value={formData.prefecture}
                    onChange={(value) =>
                      updateFormData("prefecture", value as string)
                    }
                    options={prefectures}
                    errorMessage={errors.prefecture}
                  />
                </GridItem>
                <GridItem span={12}>
                  <TextField
                    label="市区町村"
                    value={formData.city}
                    onChangeText={(text) => updateFormData("city", text)}
                    errorMessage={errors.city}
                    required
                  />
                </GridItem>
                <GridItem span={12}>
                  <TextField
                    label="番地・建物名"
                    value={formData.address}
                    onChangeText={(text) => updateFormData("address", text)}
                    errorMessage={errors.address}
                    required
                  />
                </GridItem>
              </Grid>
            </Card.Content>
          </Card>

          {/* 個人情報セクション */}
          <Card style={styles.section}>
            <Card.Title title="個人情報" />
            <Card.Content>
              <Grid variant="standard" spacing="comfortable">
                <GridItem span={12}>
                  <Typography variant="bodyMedium" style={styles.label}>
                    性別 *
                  </Typography>
                  <RadioButton.Group
                    value={formData.gender}
                    onValueChange={(value) => updateFormData("gender", value)}
                  >
                    <View style={styles.radioRow}>
                      <RadioButton.Item label="男性" value="male" />
                      <RadioButton.Item label="女性" value="female" />
                      <RadioButton.Item label="その他" value="other" />
                    </View>
                  </RadioButton.Group>
                  {errors.gender && (
                    <Typography variant="bodySmall" style={styles.errorText}>
                      {errors.gender}
                    </Typography>
                  )}
                </GridItem>
                <GridItem span={6}>
                  <DatePicker
                    type="single"
                    label="生年月日"
                    value={formData.birthDate || undefined}
                    onChange={(date) =>
                      updateFormData("birthDate", date || null)
                    }
                    validRange={{ endDate: new Date() }}
                    errorMessage={errors.birthDate}
                    required
                  />
                </GridItem>
                <GridItem span={6}>
                  <Select
                    label="職業"
                    value={formData.occupation}
                    onChange={(value) =>
                      updateFormData("occupation", value as string)
                    }
                    options={occupations}
                    errorMessage={errors.occupation}
                  />
                </GridItem>
              </Grid>
            </Card.Content>
          </Card>

          {/* 趣味・設定セクション */}
          <Card style={styles.section}>
            <Card.Title title="趣味・設定" />
            <Card.Content>
              <Grid variant="standard" spacing="comfortable">
                <GridItem span={12}>
                  <CheckboxList
                    parent="趣味（複数選択可）"
                    items={hobbiesItems}
                    checkedKeys={formData.hobbies}
                    onChangeChecks={(checkedKeys) =>
                      updateFormData("hobbies", checkedKeys)
                    }
                  />
                </GridItem>
                <GridItem span={6}>
                  <Typography variant="bodyMedium" style={styles.label}>
                    希望連絡時間
                  </Typography>
                  <TimePicker
                    value={formData.preferredTime || undefined}
                    onChange={(time) =>
                      updateFormData("preferredTime", time || null)
                    }
                  />
                </GridItem>
                <GridItem span={6}>
                  <Typography variant="bodyMedium" style={styles.label}>
                    予算: ¥{formData.budget.toLocaleString()}
                  </Typography>
                  <Slider
                    value={formData.budget}
                    onChange={(value) =>
                      updateFormData("budget", value as number)
                    }
                    minValue={10000}
                    maxValue={1000000}
                    step={10000}
                  />
                </GridItem>
                <GridItem span={12}>
                  <Divider />
                </GridItem>
                <GridItem span={6}>
                  <Switch
                    selected={formData.newsletter}
                    label="メールマガジンを受け取る"
                    onPress={() =>
                      updateFormData("newsletter", !formData.newsletter)
                    }
                  />
                </GridItem>
                <GridItem span={6}>
                  <Switch
                    selected={formData.notifications}
                    label="プッシュ通知を受け取る"
                    onPress={() =>
                      updateFormData("notifications", !formData.notifications)
                    }
                  />
                </GridItem>
              </Grid>
            </Card.Content>
          </Card>

          {/* 同意事項セクション */}
          <Card style={styles.section}>
            <Card.Title title="同意事項" />
            <Card.Content>
              <Grid variant="standard" spacing="comfortable">
                <GridItem span={12}>
                  <Checkbox
                    checked={formData.termsAccepted}
                    onChangeCheck={(checked) => {
                      if (typeof checked !== "boolean") return;
                      updateFormData("termsAccepted", checked);
                    }}
                    label="利用規約に同意する *"
                  />
                  {errors.termsAccepted && (
                    <Typography variant="bodySmall" style={styles.errorText}>
                      {errors.termsAccepted}
                    </Typography>
                  )}
                </GridItem>
                <GridItem span={12}>
                  <Checkbox
                    checked={formData.privacyAccepted}
                    onChangeCheck={(checked) => {
                      if (typeof checked !== "boolean") return;
                      updateFormData("privacyAccepted", checked);
                    }}
                    label="プライバシーポリシーに同意する *"
                  />
                  {errors.privacyAccepted && (
                    <Typography variant="bodySmall" style={styles.errorText}>
                      {errors.privacyAccepted}
                    </Typography>
                  )}
                </GridItem>
                <GridItem span={12}>
                  <Checkbox
                    checked={formData.marketingAccepted}
                    onChangeCheck={(checked) => {
                      if (typeof checked !== "boolean") return;
                      updateFormData("marketingAccepted", checked);
                    }}
                    label="マーケティング情報の受信に同意する"
                  />
                </GridItem>
              </Grid>
            </Card.Content>
          </Card>

          {/* 送信ボタン */}
          <View style={styles.submitSection}>
            <Button
              variant="filled"
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "送信中..." : "登録する"}
            </Button>
          </View>
        </ScrollView>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
        >
          {snackbarMessage}
        </Snackbar>
      </AppLayout>
    );
  },
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  radioRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  submitSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitButton: {
    paddingVertical: 8,
  },
  errorText: {
    color: "#B3261E",
    marginTop: 4,
  },
});
