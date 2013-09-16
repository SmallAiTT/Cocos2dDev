package com.tt.game;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

public class ResGen {

	public static void main(String[] args) {
		List<String> projDirList = new ArrayList<String>();
		projDirList.add("res");
		projDirList.add("src");
		projDirList.add("test");

		String ttBase = "/Users/small/WebstormProjects/Dev/tt/";
		PathCfg ttCfg = new PathCfg(ttBase, "src");

//		String projBase = "/Users/small/WebstormProjects/Dev/mg/";
		String projBase = "/Users/small/WebstormProjects/Dev/myLdt/";
		PathCfg projCfg = new PathCfg(projBase, projDirList);
		
		List<PathCfg> pathCfgList = new ArrayList<PathCfg>();
		pathCfgList.add(ttCfg);
		pathCfgList.add(projCfg);

		ResGen gen = new ResGen(pathCfgList, projBase + "cfg/Res.js");
		gen.gen();
	}

	public static class PathCfg{
		public String base = "";
		public List<String> dirList;
		
		public PathCfg(String base){
			this.base = base;
			this.dirList = new ArrayList<String>();
		}
		
		public PathCfg(String base, List<String> dirList){
			this.base = base;
			this.dirList = dirList;
		}
		
		public PathCfg(String base, String dir){
			this.base = base;
			this.dirList = new ArrayList<String>();
			this.dirList.add(dir);
		}
	}
	
	private List<PathCfg> pathCfgList = new ArrayList<PathCfg>();
	private List<String> resList = new ArrayList<String>();
	private String outputPath = "";

	static List<String> fileTypeList = new ArrayList<String>();

	static {
		fileTypeList.add("png");
		fileTypeList.add("jpg");
		fileTypeList.add("bmp");
		fileTypeList.add("jpeg");
		fileTypeList.add("gif");
		fileTypeList.add("mp3");
		fileTypeList.add("ogg");
		fileTypeList.add("wav");
		fileTypeList.add("mp4");
		fileTypeList.add("plist");
		fileTypeList.add("xml");
		fileTypeList.add("fnt");
		fileTypeList.add("tmx");
		fileTypeList.add("tsx");
		fileTypeList.add("ccbi");
		fileTypeList.add("font");
		fileTypeList.add("txt");
		fileTypeList.add("vsh");
		fileTypeList.add("fsh");
		fileTypeList.add("json");
		fileTypeList.add("js");
	}
	
	public ResGen(List<PathCfg> pathCfgList, String outputPath){
		this.pathCfgList = pathCfgList;
		this.outputPath = outputPath;
	}

	public void parse(File file, String baseDir){
		if(file == null || file.isFile()) return;
		File[] files = file.listFiles();
		for(int i = 0; i < files.length; ++i){
			if(files[i].isDirectory()){
				this.parse(files[i], baseDir);
			}else if(files[i].isFile()){
				String name = files[i].getName();
				int index = name.lastIndexOf(".");
				if(index <= 0) continue;
				String fileType = name.substring(index + 1).toLowerCase();
				if(fileTypeList.indexOf(fileType) < 0) continue;
				String path = files[i].getPath();
				System.out.println(path);
				path = path.substring(baseDir.length());
				path = path.replaceAll("\\\\", "/");
				resList.add(path);
			}
		}
	}
	public void gen(){
		System.out.println("|---------------------------------------|");
		System.out.println("|        ResGen                         |");
		System.out.println("|        Author: Small                  |");
		System.out.println("|        Version: 1.0.0                 |");
		System.out.println("|---------------------------------------|");
		System.out.println("+++++++++++++gen Start+++++++++++++++++");
		for(int i = 0; i < this.pathCfgList.size(); ++i){
			PathCfg pc = pathCfgList.get(i);
			for(int j = 0; j < pc.dirList.size(); ++j){
				parse(new File(pc.base + pc.dirList.get(j)), pc.base);
			}
		}

		FileOutputStream out = null;
		try{
            out=new FileOutputStream(this.outputPath);
            PrintStream ps=new PrintStream(out);
            ps.println("Res = {");
    		for(int i = 0; i < resList.size(); ++i){
    			StringBuffer sb = new StringBuffer();
    			sb.append("    ").append(GameUtils.getKeyName(resList.get(i))).append(" : '").append(resList.get(i)).append("'");
    			if(i < resList.size() - 1) sb.append(",");
    			ps.println(sb);
    		}
    		ps.println("};");
    		ps.close();
        } catch (FileNotFoundException e){
            e.printStackTrace();
        } finally{
    		if(out != null)
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
        }
		System.out.println("+++++++++++++gen End+++++++++++++++++++");
	};
	
}
