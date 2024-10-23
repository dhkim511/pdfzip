import React, { ReactElement } from "react";
import { Space, Typography } from "antd";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
const { Text } = Typography;

interface FormLabelProps {
  icon: ReactElement<AntdIconProps>;
  children: React.ReactNode;
}

export const FormLabel: React.FC<FormLabelProps> = ({ icon, children }) => (
  <Space size={4}>
    {React.cloneElement(icon, {
      style: { fontSize: "16px", color: "#595959" },
    })}
    <Text strong style={{ color: "#595959" }}>
      {children}
    </Text>
  </Space>
);
