import React, { useState } from "react";

import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  Textarea,
} from "@strapi/design-system";

export const ImportModal = ({ setShowModal, addVersion, versionTable }) => {
  const [modpackJson, setModpackJson] = useState("");

  let validInput = false;

  const handleSubmit = async (e) => {
    // Prevent submitting parent form
    e.preventDefault();
    e.stopPropagation();

    var jsonObj = JSON.parse(modpackJson);

    try {
      await addVersion(jsonObj);
      setShowModal(false);
    } catch (e) {
      console.log("error", e);
    }
  };

  const getError = () => {
    // Form validation error
    validInput = false;
    let jsonObj = {}
    try {
      jsonObj = JSON.parse(modpackJson);
    }
    catch (e) {
      return "JSON is malformed"
    }

    if (Object.keys(jsonObj).length === 0) {
      return "JSON is empty";
    }

    if (!jsonObj.hasOwnProperty("title")
      || !jsonObj.hasOwnProperty("name")
      || !jsonObj.hasOwnProperty("version")
      || !jsonObj.hasOwnProperty("gameVersion")
      || !jsonObj.hasOwnProperty("features")
      || !jsonObj.hasOwnProperty("tasks")
      || !jsonObj.hasOwnProperty("versionManifest")
      || !jsonObj.hasOwnProperty("launch")
    ) {
      return "Not a valid version file";
    }

    var semver = require('semver');
    if (!semver.valid(jsonObj.version)) {
      return "'" + jsonObj.version + "' is not a valid semantic version. i.e '1.0.0' or '1.0.0-1.0'"
    }

    if (jsonObj.name in versionTable) {
      for (var i = 0; i < versionTable[jsonObj.name].length; i++) {
        var currentVersion = versionTable[jsonObj.name][i].version;
        if (currentVersion === jsonObj.version) {
          return "'" + currentVersion + "' is already the latest version";
        }
        if (semver.gte(currentVersion, jsonObj.version)) {
          return "Current version '" + currentVersion + "' is greater than '" + jsonObj.version + "'";
        }
      }
    }

    validInput = true;
    return null;
  };

  return (
    <ModalLayout
      onClose={() => setShowModal(false)}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Import Modpack Version
        </Typography>
      </ModalHeader>

      <ModalBody>
        <Textarea
          placeholder="Paste JSON"
          label="<name>.json:"
          name="text"
          error={getError()}
          onChange={(e) => setModpackJson(e.target.value)}
          value={modpackJson}
        />
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={() => setShowModal(false)} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={validInput ? (<Button type="submit">Import</Button>) : (<Button type="submit" disabled="true">Import</Button>)}
      />
    </ModalLayout>
  );
}