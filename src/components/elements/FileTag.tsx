/** @jsxImportSource @emotion/react */
import React from "react";
import { Tag, Typography } from "antd";
import { ConversionType } from "../../types/conversionType";
import { getFileLabel } from "../../utils/labelHandle";
import { fileTag } from "../../styles/styles";

interface FileRequirement {
  category?: string;
  files: string[];
}

const { Text } = Typography;

interface FileTagProps {
  type: ConversionType;
}

const FileTag: React.FC<FileTagProps> = ({ type }) => {
  const renderRequirement = (requirement: FileRequirement) => {
    return (
      <div css={fileTag.requirementContainer}>
        {requirement.category && (
          <Text strong style={fileTag.categoryText}>
            {requirement.category}:
          </Text>
        )}
        <div css={fileTag.filesContainer}>
          {requirement.files.map((file, index) => (
            <Tag key={index} color="error" style={{ margin: 0 }}>
              {file}
            </Tag>
          ))}
        </div>
      </div>
    );
  };

  const label = getFileLabel(type);

  return (
    <div css={fileTag.container}>
      <div css={fileTag.tagWrapper}>
        {Array.isArray(label.primary)
          ? label.primary.map((req) => renderRequirement(req))
          : renderRequirement(label.primary)}
      </div>
      {label.warning && (
        <div css={fileTag.tagWrapper}>{renderRequirement(label.warning)}</div>
      )}
    </div>
  );
};

export default FileTag;
