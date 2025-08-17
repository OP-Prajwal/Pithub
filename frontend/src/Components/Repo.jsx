import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function TreeNode({ name, node, onSelectFile }) {
  const [expanded, setExpanded] = useState(false);
  const isFolder = typeof node === 'object' && !node.type;

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded);
    } else {
      onSelectFile?.({ name, content: node.content });
    }
  };

  return (
    <div style={{ marginLeft: '16px' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={handleClick}
      >
        {isFolder ? (
          expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        ) : (
          <FileText size={14} />
        )}
        <span style={{ marginLeft: '4px', fontWeight: isFolder ? 'bold' : 'normal' }}>
          {name}
        </span>
      </div>
      {expanded && isFolder && (
        <div style={{ marginLeft: '12px', borderLeft: '1px dashed #ccc', paddingLeft: '8px' }}>
          {Object.entries(node).map(([childName, childNode]) => (
            <TreeNode
              key={childName}
              name={childName}
              node={childNode}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Repo() {
  const { repoid } = useParams();
  const [treeData, setTreeData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = new URLSearchParams(useLocation().search);
  const user = useSelector((state) => state.user);
  const [showQuickSetup, setShowQuickSetup] = useState(false);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/repo/veiw/${repoid}`);
        const { treeHash, files } = res.data;
        const structure = parseGitTree(treeHash, files);
        const hasFiles = Object.keys(structure).length > 0;

        setTreeData(structure);
        setShowQuickSetup(!hasFiles);
      } catch (err) {
        console.error('Error loading repo:', err);
        setTreeData(null);
        setShowQuickSetup(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRepo();
  }, [repoid]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Repo: {repoid}</h1>

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : showQuickSetup ? (
        <div className="mt-4 bg-yellow-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Quick setup — if you’re starting from scratch</h2>
          <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
{`mypit init
mypit add .
mypit commit -m "first commit"
mypit remote:add http://localhost:3000/${user.name}/${repoid}
mypit push`}
          </pre>
        </div>
      ) : (
        <div className="flex border rounded h-[70vh] overflow-hidden">
          {/* Left panel: tree */}
          <div className="w-1/3 p-4 border-r overflow-auto">
            <h2 className="font-bold mb-2">📁 Repository</h2>
            <TreeNode name="root" node={treeData} onSelectFile={setSelectedFile} />
          </div>

          {/* Right panel: file content */}
          <div className="w-2/3 p-4 overflow-auto">
            {selectedFile ? (
              <div>
                <h2 className="text-lg font-semibold mb-2">📄 {selectedFile.name}</h2>
                <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
                  {selectedFile.content || '[Empty file]'}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500">Select a file to view its content</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function parseGitTree(treeHash, files) {
  const tree = files[treeHash];
  if (!tree || tree.type !== 'tree') return {};

  const result = {};
  const lines = tree.content.trim().split('\n');

  for (const line of lines) {
    const [type, hash, filePath] = line.split(' ');
    const parts = filePath.split(/[\\/]/);

    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        current[part] = {
          type,
          content: files[hash]?.content || '',
          hash,
        };
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }
  }

  return result;
}

export default Repo;
