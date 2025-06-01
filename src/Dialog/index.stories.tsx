import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { ScrollView, View } from "react-native";
import { Dialog as Component } from ".";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Grid, GridItem } from "../Grid";
import { Select } from "../Select";
import { Switch } from "../Switch";
import { TextField } from "../TextField";
import { Typography } from "../Typography";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["basic", "full-screen"],
    },
    headline: {
      control: { type: "text" },
    },
    supportingText: {
      control: { type: "text" },
    },
    icon: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    variant: "basic",
    headline: "Dialog Title",
    supportingText:
      "This is a supporting text that provides more information about the dialog content.",
    children: <Button>Open Dialog</Button>,
  },
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
};

export const Behavior: Story = {
  args: {
    variant: "basic",
    headline: "Confirm Action",
    supportingText: "Please confirm that you want to proceed with this action.",
    icon: "alert-circle",
    actions: [
      {
        label: "Cancel",
        onPress: () => console.log("Cancel pressed"),
      },
      {
        label: "Confirm",
        onPress: () => console.log("Confirm pressed"),
      },
    ],
    children: <Button>Open Dialog</Button>,
  },
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the trigger button
    const triggerButton = canvas.getByText("Open Dialog");
    await userEvent.click(triggerButton);

    // Wait for dialog to appear and verify content
    await expect(canvas.getByText("Confirm Action")).toBeInTheDocument();
    await expect(
      canvas.getByText(
        "Please confirm that you want to proceed with this action.",
      ),
    ).toBeInTheDocument();

    // Verify action buttons are present
    await expect(canvas.getByText("Cancel")).toBeInTheDocument();
    await expect(canvas.getByText("Confirm")).toBeInTheDocument();

    // Click cancel to close dialog
    const cancelButton = canvas.getByText("Cancel");
    await userEvent.click(cancelButton);
  },
};

export const Basic: Story = {
  args: {
    variant: "basic",
    headline: "Delete Account",
    supportingText:
      "This will permanently delete your account and all associated data. This action cannot be undone.",
    icon: "account-remove",
    content: (
      <View style={{ gap: 12 }}>
        <Typography variant="bodyMedium" color="onSurfaceVariant">
          The following items will be permanently deleted:
        </Typography>
        <View style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingVertical: 8,
            }}
          >
            <Typography variant="bodyMedium" color="onSurface">
              •
            </Typography>
            <Typography variant="bodyMedium" color="onSurface">
              Profile information and settings
            </Typography>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingVertical: 8,
            }}
          >
            <Typography variant="bodyMedium" color="onSurface">
              •
            </Typography>
            <Typography variant="bodyMedium" color="onSurface">
              All uploaded files and documents
            </Typography>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingVertical: 8,
            }}
          >
            <Typography variant="bodyMedium" color="onSurface">
              •
            </Typography>
            <Typography variant="bodyMedium" color="onSurface">
              Subscription and billing history
            </Typography>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingVertical: 8,
            }}
          >
            <Typography variant="bodyMedium" color="onSurface">
              •
            </Typography>
            <Typography variant="bodyMedium" color="onSurface">
              Shared content and collaborations
            </Typography>
          </View>
        </View>
      </View>
    ),
    actions: [
      {
        label: "Cancel",
        onPress: () => console.log("Cancel pressed"),
      },
      {
        label: "Delete Account",
        onPress: () => console.log("Delete pressed"),
      },
    ],
    children: <Button variant="filled">Delete Account</Button>,
  },
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
};

export const FullScreen: Story = {
  args: {
    variant: "full-screen",
    headline: "Create Account",
    content: (
      <View style={{ gap: 20 }}>
        <Typography variant="bodyMedium" color="onSurfaceVariant">
          Fill out the form below to create your account.
        </Typography>

        <ScrollView>
          <Grid spacing="comfortable">
            <GridItem span={6}>
              <TextField
                label="First Name"
                required
                variant="outlined"
                value=""
                onChangeText={() => {}}
              />
            </GridItem>

            <GridItem span={6}>
              <TextField
                label="Last Name"
                required
                variant="outlined"
                value=""
                onChangeText={() => {}}
              />
            </GridItem>

            <GridItem span={12}>
              <TextField
                label="Email Address"
                required
                variant="outlined"
                keyboardType="email-address"
                value=""
                onChangeText={() => {}}
              />
            </GridItem>

            <GridItem span={6}>
              <TextField
                label="Phone Number"
                variant="outlined"
                keyboardType="phone-pad"
                value=""
                onChangeText={() => {}}
              />
            </GridItem>

            <GridItem span={6}>
              <Select
                label="Country"
                required
                variant="outlined"
                value=""
                onChange={() => {}}
                options={[
                  { label: "United States", value: "us" },
                  { label: "Japan", value: "jp" },
                  { label: "United Kingdom", value: "uk" },
                  { label: "Germany", value: "de" },
                  { label: "France", value: "fr" },
                ]}
              />
            </GridItem>

            <GridItem span={6}>
              <TextField
                label="Company"
                variant="outlined"
                value=""
                onChangeText={() => {}}
              />
            </GridItem>

            <GridItem span={6}>
              <Select
                label="Job Title"
                variant="outlined"
                value=""
                onChange={() => {}}
                options={[
                  { label: "Software Engineer", value: "engineer" },
                  { label: "Product Manager", value: "pm" },
                  { label: "Designer", value: "designer" },
                  { label: "Marketing", value: "marketing" },
                  { label: "Sales", value: "sales" },
                  { label: "Other", value: "other" },
                ]}
              />
            </GridItem>

            <GridItem span={12}>
              <TextField
                label="Bio"
                variant="outlined"
                multiline
                maxLines={4}
                supportingText="Tell us a bit about yourself (optional)"
                value=""
                onChangeText={() => {}}
              />
            </GridItem>

            <GridItem span={12}>
              <View style={{ gap: 12, marginTop: 8 }}>
                <Checkbox
                  checked={false}
                  onChangeCheck={() => {}}
                  label="I agree to receive marketing emails"
                />

                <Checkbox
                  checked={false}
                  onChangeCheck={() => {}}
                  label="I agree to the Terms of Service and Privacy Policy *"
                />

                <Switch
                  value={false}
                  onValueChange={() => {}}
                  label="Enable two-factor authentication"
                />
              </View>
            </GridItem>
          </Grid>
        </ScrollView>
      </View>
    ),
    actions: [
      {
        label: "Cancel",
        onPress: () => console.log("Cancel pressed"),
      },
      {
        label: "Create Account",
        onPress: () => console.log("Create pressed"),
      },
    ],
    children: <Button variant="filled">Create Account</Button>,
  },
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
};
