import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  DraftEditorCommand,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { linkDecorator } from "./Links";
import { mediaBlockRenderer } from "./Media";
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ImageIcon from '@mui/icons-material/Image';
import { convertToHTML, convertFromHTML } from 'draft-convert';

const TextEditor: React.FC = () => {

  const [editorState, setEditorState] = React.useState<EditorState>(EditorState.createEmpty(linkDecorator));




  const handleSave = () => {
    console.log(convertToHTML(editorState.getCurrentContent()));

  };

  const handleInsertImage = () => {
    const src = prompt("Please enter the URL of your picture");
    if (!src) {
      return;
    }
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity("image", "IMMUTABLE", { src });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    return setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));
  };

  const handleAddLink = () => {
    const selection = editorState.getSelection();
    const link = prompt("Please enter the URL of your link");
    if (!link) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
      return;
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link
    });
    const newEditorState = EditorState.push(editorState, contentWithEntity, "apply-entity");
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));
  };

  const handleKeyCommand = (command: DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleTogggleClick = (e: React.MouseEvent, inlineStyle: string) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleBlockClick = (e: React.MouseEvent, blockType: string) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  return (
    <div className="texteditor">

      <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>

      <Button
        sx={{ my: 2, color: 'black', display: 'block' }}
        onMouseDown={(e) => handleBlockClick(e, "header-one")}>
          <h1>H1</h1>
      </Button>
      <Button
        sx={{ my: 2, color: 'black', display: 'block' }}
        onMouseDown={(e) => handleBlockClick(e, "header-two")}>
          <h2>H2</h2>
      </Button>
      <Button 
        sx={{ my: 2, color: 'black', display: 'block' }} 
        onMouseDown={(e) => handleBlockClick(e, "header-three")}>
          <h3>H3</h3>
      </Button>
      <Button 
        sx={{ my: 2, color: 'black', display: 'block' }}
        onMouseDown={(e) => handleBlockClick(e, "unstyled")}>
          Normal
      </Button>
      <Button 
        sx={{ my: 2, color: 'black', display: 'block' }} 
        onMouseDown={(e) => handleTogggleClick(e, "BOLD")}>
          <b>bold</b>
      </Button>
      <Button 
        sx={{ my: 2, color: 'black', display: 'block' }} 
        onMouseDown={(e) => handleTogggleClick(e, "UNDERLINE")}>
          <u>underline</u>
      </Button>
      <Button 
        sx={{ my: 2, color: 'black', display: 'block' }} 
        onMouseDown={(e) => handleTogggleClick(e, "ITALIC")}>
        <i>italic</i>
      </Button>
      <Button 
        sx={{ my: 2, color: 'black', display: 'block' }} 
        onMouseDown={(e) => handleTogggleClick(e, "STRIKETHROUGH")}>
          <strike>strikthrough</strike>
      </Button>
      <Button 
        sx={{ my: 2, color: 'black', display: 'block' }} 
        onMouseDown={(e) => handleBlockClick(e, "ordered-list-item")}>
          <FormatListNumberedIcon />
      </Button>
      <Button 
        sx={{ my: 2, color: 'black', display: 'block' }} 
        onMouseDown={(e) => handleBlockClick(e, "unordered-list-item")}>
          <FormatListBulletedIcon />
      </Button>
      <Button
        sx={{ my: 2, color: 'black', display: 'block' }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleInsertImage();
        }}>
        <ImageIcon />
      </Button>
      <Button
        sx={{ my: 2, color: 'black', display: 'block' }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleAddLink();
        }}>
        link
      </Button>
      <Button
        sx={{ my: 2, color: 'black', display: 'block' }}
        onMouseDown={() => setEditorState(EditorState.undo(editorState))}>
            Cancel
      </Button>
      <Button
        sx={{ my: 2, color: 'black', display: 'block' }}
        onMouseDown={() => setEditorState(EditorState.redo(editorState))}>
            Redo
      </Button>

    
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        blockRendererFn={mediaBlockRenderer}
      />
      <Button
        className="save"
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          handleSave();
        }}>
        save
      </Button>

    </div>
  );
};

export default TextEditor;
