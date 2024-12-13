import React, { ReactElement } from "react";
import { Space, Typography } from "antd";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { labelIcon, labelText } from "../../styles/custom";

const { Text } = Typography;

interface FormLabelProps {
  icon: ReactElement<AntdIconProps>;
  children: React.ReactNode;
}

export const FormLabel: React.FC<FormLabelProps> = ({ icon, children }) => (
  <Space size={4}>
    {React.cloneElement(icon, { style: labelIcon })}
    <Text strong style={labelText}>
      {children}
    </Text>
  </Space>
);
