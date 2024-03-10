import React, { useEffect, useState } from "react";
import { Layout, BaseHeaderLayout, ContentLayout, Button, EmptyStateLayout } from "@strapi/design-system";
import { Plus } from '@strapi/icons';
import { Illo } from '../../components/Illo';
import { ImportModal } from "../../components/ImportModal";
import { VersionTable } from "../../components/VersionTable";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import { useFetchClient } from "@strapi/helper-plugin";

const VersionUtils = () => {
  const [versionTable, setVersionTable] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { get, post, del } = useFetchClient();

  const fetchData = async () => {
    console.log("fetching data");
    if (!isLoading) {
      setIsLoading(true);
    }

    const { data } = await get("/launcher/versionTable");
    setVersionTable(data);
    setIsLoading(false);
  }

  useEffect(() => {
    const clear = async () => {
      await fetchData();
    };
    clear();
  }, []);

  async function addVersion(data) {
    await post("/launcher/create", data);
    await fetchData();
  }

  async function deleteVersion(id) {
    await del(`/launcher/delete/${id}`);
    await fetchData();
  }

  function hasVersions() {
    var keyList = Object.keys(versionTable);
    for (var i = 0; i < keyList.length; i++) {
      if (versionTable[keyList[i]].length > 0) {
        return true;
      }
    }
    return false;
  }

  if (isLoading) {
    return <LoadingIndicatorPage />
  }

  return (
    <Layout sideNav={null}>
      <BaseHeaderLayout
        title="Modpack Versions"
        subtitle="Import a new modpack version from Modpack Creator's JSON output"
        as="h2"
      />

      <ContentLayout>
        {hasVersions() ?
          (
            <VersionTable
              versionTable={versionTable}
              deleteVersion={deleteVersion}
              setShowModal={setShowModal}
            />
          )
          : <EmptyStateLayout
            icon={<Illo />}
            content="There are no modpack versions yet..."
            action={
              <Button
                onClick={() => setShowModal(true)}
                variant="secondary"
                startIcon={<Plus />}
              >
                Import Modpack Version
              </Button>
            }
          />
        }
      </ContentLayout>
      {showModal && <ImportModal setShowModal={setShowModal} addVersion={addVersion} versionTable={versionTable} />}
    </Layout>
  );
};

export default VersionUtils;
