import React from "react";
import {
  Table,
  Thead,
  TFooter,
  Tbody,
  Tr,
  Td,
  Th,
  Box,
  Flex,
  Typography,
  IconButton,
  VisuallyHidden
} from "@strapi/design-system";
import { Trash, Plus } from "@strapi/icons";

export const VersionTable = ({
  versionTable,
  deleteVersion,
  setShowModal,
}) => {
  var rows = [];
  var keyList = Object.keys(versionTable);
  for (var i = 0; i < keyList.length; i++) {
    for (var j = 0; j < versionTable[keyList[i]].length; j++) {
      var manifest = versionTable[keyList[i]][j];
      rows.push(
        <Tr key = { manifest.id }>
          <Td>
            <Typography textColor = "neutral800">{ manifest.modpack.title }</Typography>
          </Td>

          <Td>
              <Typography textColor = "neutral800">{ manifest.version }</Typography>
          </Td>

          <Td>
            <Typography textColor = "neutral800">{ manifest.gameVersion }</Typography>
          </Td>

          <Td>
            <Typography textColor = "neutral800">{ (manifest.isPreview ? "Yes" : "No") }</Typography>
          </Td>

          <Td>
            <Flex style = { { justifyContent: "end" } }>
              <Box>
                <IconButton
                  onClick = { () => deleteVersion(manifest.id) }
                  label = "Delete"
                  noBorder
                  icon = { <Trash /> }
                />
              </Box>
            </Flex>
          </Td>
        </Tr>
      );
    }
  }
  return (
    <Box
      background = "neutral0"
      hasRadius = { true }
      shadow = "filterShadow"
      padding = {8}
      style = { { marginTop: "10px" } }
    >
      <Table
        colCount = { 4 }
        rowCount = { 10 }
        footer = {
          <TFooter onClick={() => setShowModal(true)} icon = { <Plus /> }>
            Add a version
          </TFooter>
        }
      >
        <Thead>
          <Tr>
            <Th action = { null }>
              <Typography variant="sigma">Title</Typography>
            </Th>

            <Th action = { null }>
              <Typography variant="sigma">Latest Version</Typography>
            </Th>

            <Th action = { null }>
              <Typography variant="sigma">Game Version</Typography>
            </Th>

            <Th action = { null }>
              <Typography variant="sigma">Is Preview</Typography>
            </Th>

            <Th action = { null }>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          { rows }
        </Tbody>
      </Table>
    </Box>
  );
}